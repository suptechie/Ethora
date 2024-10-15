export const throttle = <T extends (...arguments_: any[]) => void>(
  function_: T,
  delay: number
): T => {
  let lastInvokeTime = 0
  let timeoutId: NodeJS.Timeout | null = null

  return ((...arguments_: any[]) => {
    const now = Date.now()
    const timeSinceLastInvoke = now - lastInvokeTime

    const invoke = () => {
      lastInvokeTime = Date.now()
      function_(...arguments_)
    }

    if (timeSinceLastInvoke >= delay) {
      if (timeoutId) {
        clearTimeout(timeoutId)
        timeoutId = null
      }
      invoke()
    } else if (!timeoutId) {
      timeoutId = setTimeout(() => {
        invoke()
      }, delay - timeSinceLastInvoke)
    }
  }) as T
}
