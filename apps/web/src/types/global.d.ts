declare global {
  interface Window {
    LA: {
      init: (config: {
        id: string
        ck: string
        autoTrack?: boolean
        hashMode?: boolean
      }) => void
    }
  }
}

export {}
