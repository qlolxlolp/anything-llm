export interface AutopilotConfig {
  id?: string;
  isActive: boolean;
  autoScan: boolean;
  autoOCR: boolean;
  autoOrganize: boolean;
  autoBackup: boolean;
  scanInterval: number; // seconds
  ocrTimeout: number; // seconds
  backupInterval: number; // seconds
  maxConcurrentJobs: number;
}

export interface AutopilotStatus {
  isActive: boolean;
  currentJobs: number;
  completedJobs: number;
  failedJobs: number;
  lastActivity?: string;
  uptime: number; // seconds
}

export interface AutopilotJob {
  id: string;
  type: 'SCAN' | 'OCR' | 'ORGANIZE' | 'BACKUP' | 'CLEANUP' | 'MAINTENANCE';
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  priority: number;
  inputData?: any;
  outputData?: any;
  errorMessage?: string;
  startedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
}

export interface AutopilotActivity {
  id: string;
  type: 'SYSTEM' | 'SCAN' | 'OCR' | 'ORGANIZE' | 'BACKUP' | 'ERROR' | 'WARNING' | 'INFO';
  action: string;
  description: string;
  metadata?: any;
  status: 'SUCCESS' | 'WARNING' | 'ERROR' | 'INFO';
  duration?: number; // milliseconds
  createdAt: Date;
}

class AutopilotService {
  private apiUrl = '/api/autopilot';
  private config: AutopilotConfig | null = null;
  private status: AutopilotStatus = {
    isActive: false,
    currentJobs: 0,
    completedJobs: 0,
    failedJobs: 0,
    uptime: 0
  };
  private jobs: AutopilotJob[] = [];
  private activities: AutopilotActivity[] = [];
  private intervalId: NodeJS.Timeout | null = null;

  async getConfig(): Promise<AutopilotConfig> {
    try {
      const response = await fetch(`${this.apiUrl}/config`);
      if (response.ok) {
        this.config = await response.json();
        return this.config!;
      }
    } catch (error) {
      console.error('Failed to fetch autopilot config:', error);
    }
    
    // Return default config if API fails
    const defaultConfig: AutopilotConfig = {
      isActive: false,
      autoScan: true,
      autoOCR: true,
      autoOrganize: false,
      autoBackup: true,
      scanInterval: 300,
      ocrTimeout: 30,
      backupInterval: 86400,
      maxConcurrentJobs: 3
    };
    
    this.config = defaultConfig;
    return defaultConfig;
  }

  async updateConfig(config: AutopilotConfig): Promise<AutopilotConfig> {
    try {
      const response = await fetch(`${this.apiUrl}/config`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });
      
      if (response.ok) {
        this.config = await response.json();
        
        // Restart autopilot if config changed
        if (this.config && this.config.isActive) {
          await this.start();
        } else {
          await this.stop();
        }
        
        return this.config || config;
      }
    } catch (error) {
      console.error('Failed to update autopilot config:', error);
    }
    
    // Fallback to local update
    this.config = config;
    return config;
  }

  async getStatus(): Promise<AutopilotStatus> {
    try {
      const response = await fetch(`${this.apiUrl}/status`);
      if (response.ok) {
        this.status = await response.json();
        return this.status;
      }
    } catch (error) {
      console.error('Failed to fetch autopilot status:', error);
    }
    
    return this.status;
  }

  async start(): Promise<void> {
    if (!this.config) {
      await this.getConfig();
    }
    
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    
    this.status.isActive = true;
    this.addActivity('SYSTEM', 'START', 'Autopilot started', 'SUCCESS');
    
    // Start main autopilot loop
    this.intervalId = setInterval(() => {
      this.processJobs();
    }, 5000); // Check every 5 seconds
    
    try {
      await fetch(`${this.apiUrl}/start`, { method: 'POST' });
    } catch (error) {
      console.error('Failed to start autopilot on server:', error);
    }
  }

  async stop(): Promise<void> {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    
    this.status.isActive = false;
    this.addActivity('SYSTEM', 'STOP', 'Autopilot stopped', 'INFO');
    
    try {
      await fetch(`${this.apiUrl}/stop`, { method: 'POST' });
    } catch (error) {
      console.error('Failed to stop autopilot on server:', error);
    }
  }

  async addJob(type: AutopilotJob['type'], inputData?: any, priority: number = 5): Promise<string> {
    const job: AutopilotJob = {
      id: `job-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      status: 'PENDING',
      priority,
      inputData,
      createdAt: new Date()
    };
    
    this.jobs.push(job);
    this.addActivity('SYSTEM', 'JOB_CREATED', `Job ${type} created`, 'INFO');
    
    try {
      await fetch(`${this.apiUrl}/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(job),
      });
    } catch (error) {
      console.error('Failed to create job on server:', error);
    }
    
    return job.id;
  }

  async getJobs(): Promise<AutopilotJob[]> {
    try {
      const response = await fetch(`${this.apiUrl}/jobs`);
      if (response.ok) {
        this.jobs = await response.json();
        return this.jobs;
      }
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    }
    
    return this.jobs;
  }

  async getActivities(limit: number = 50): Promise<AutopilotActivity[]> {
    try {
      const response = await fetch(`${this.apiUrl}/activities?limit=${limit}`);
      if (response.ok) {
        this.activities = await response.json();
        return this.activities;
      }
    } catch (error) {
      console.error('Failed to fetch activities:', error);
    }
    
    return this.activities.slice(-limit);
  }

  private async processJobs(): Promise<void> {
    if (!this.config?.isActive) return;
    
    const pendingJobs = this.jobs
      .filter(job => job.status === 'PENDING')
      .sort((a, b) => b.priority - a.priority)
      .slice(0, this.config.maxConcurrentJobs);
    
    for (const job of pendingJobs) {
      await this.executeJob(job);
    }
  }

  private async executeJob(job: AutopilotJob): Promise<void> {
    job.status = 'RUNNING';
    job.startedAt = new Date();
    this.status.currentJobs++;
    
    this.addActivity('SYSTEM', 'JOB_STARTED', `Job ${job.type} started`, 'INFO');
    
    try {
      switch (job.type) {
        case 'SCAN':
          await this.executeScanJob(job);
          break;
        case 'OCR':
          await this.executeOCRJob(job);
          break;
        case 'ORGANIZE':
          await this.executeOrganizeJob(job);
          break;
        case 'BACKUP':
          await this.executeBackupJob(job);
          break;
        case 'CLEANUP':
          await this.executeCleanupJob(job);
          break;
        case 'MAINTENANCE':
          await this.executeMaintenanceJob(job);
          break;
      }
      
      job.status = 'COMPLETED';
      job.completedAt = new Date();
      this.status.completedJobs++;
      this.addActivity('SYSTEM', 'JOB_COMPLETED', `Job ${job.type} completed`, 'SUCCESS');
      
    } catch (error: any) {
      job.status = 'FAILED';
      job.errorMessage = error.message;
      job.completedAt = new Date();
      this.status.failedJobs++;
      this.addActivity('SYSTEM', 'JOB_FAILED', `Job ${job.type} failed: ${error.message}`, 'ERROR');
    } finally {
      this.status.currentJobs--;
    }
  }

  private async executeScanJob(job: AutopilotJob): Promise<void> {
    // Implement scan logic
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate work
    job.outputData = { scannedFiles: 1 };
  }

  private async executeOCRJob(job: AutopilotJob): Promise<void> {
    // Implement OCR logic
    await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate work
    job.outputData = { extractedText: 'Sample text' };
  }

  private async executeOrganizeJob(job: AutopilotJob): Promise<void> {
    // Implement organize logic
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate work
    job.outputData = { organizedFiles: 5 };
  }

  private async executeBackupJob(job: AutopilotJob): Promise<void> {
    // Implement backup logic
    await new Promise(resolve => setTimeout(resolve, 5000)); // Simulate work
    job.outputData = { backedUpFiles: 10 };
  }

  private async executeCleanupJob(job: AutopilotJob): Promise<void> {
    // Implement cleanup logic
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate work
    job.outputData = { deletedFiles: 3 };
  }

  private async executeMaintenanceJob(job: AutopilotJob): Promise<void> {
    // Implement maintenance logic
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate work
    job.outputData = { maintenanceTasks: 2 };
  }

  private addActivity(
    type: AutopilotActivity['type'],
    action: string,
    description: string,
    status: AutopilotActivity['status'],
    metadata?: any
  ): void {
    const activity: AutopilotActivity = {
      id: `activity-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      action,
      description,
      metadata,
      status,
      createdAt: new Date()
    };
    
    this.activities.push(activity);
    
    // Keep only last 100 activities in memory
    if (this.activities.length > 100) {
      this.activities = this.activities.slice(-100);
    }
  }
}

// Export singleton instance
export const autopilotService = new AutopilotService();
