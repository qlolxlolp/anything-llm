export default function DeviceDiscoveryLoading() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="text-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
        <p className="text-muted-foreground">در حال بارگذاری بخش کشف دستگاه...</p>
      </div>
    </div>
  )
}
