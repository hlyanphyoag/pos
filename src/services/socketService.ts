import { useEffect, useRef, useState, useCallback } from "react"
import { Socket, io } from "socket.io-client"

const SOCKET_URL = "https://shopposapi.onrender.com"

export const useCartSocket = (userId: string) => {
  const socketRef = useRef<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [cartData, setCartData] = useState<any>(null)
  
  // CRITICAL FIX: Track emission states to prevent loops
  const isEmittingPaymentRef = useRef(false)
  const lastPaymentMethodRef = useRef<string | null>(null)

  useEffect(() => {
    if (!userId) return

    const socket = io(SOCKET_URL, {
      query: { userId },
      transports: ['websocket']
    })

    socketRef.current = socket

    socket.on("connect", () => {
      console.log("Cart socket connected:", userId)
      setIsConnected(true)
    })

    socket.on("disconnect", () => {
      setIsConnected(false)
      console.log("Cart socket disconnected:", userId)
    })

    socket.on("data-changes", (data) => {
      console.log("Received socket data:", data)
      
      if (!data) return

      if (isEmittingPaymentRef.current && data.paymentMethod) {
        console.log("Ignoring payment method during emission")
        return
      }

      setCartData((prevData: any) => {
        // Skip if data is identical
        if (JSON.stringify(prevData) === JSON.stringify(data)) {
          return prevData
        }

        // CRITICAL FIX: Smart merge for payment method
        let mergedData;
        
        if (!prevData) {
          mergedData = data
        } else {
          mergedData = {
            ...data,
            // Only update paymentMethod if it's explicitly provided in new data
            paymentMethod: data.hasOwnProperty('paymentMethod') 
              ? data.paymentMethod 
              : prevData.paymentMethod
          }
        }

        // Update the ref to track latest payment method
        if (mergedData.paymentMethod !== lastPaymentMethodRef.current) {
          lastPaymentMethodRef.current = mergedData.paymentMethod
        }

        return mergedData
      })
    })

    return () => {
      socket.disconnect()
    }
  }, [userId])

  const emitCartUpdate = useCallback((cart: any, subtotal: number, tax: number, total: number) => {
    if (!socketRef.current?.connected) return

    const updateData = {
      cart: cart,
      subtotal: subtotal,
      tax: tax,
      total: total,
    }
    setCartData((prevData: any) => ({
      ...prevData,
      ...updateData
    }))
    socketRef.current.emit("data-changes", updateData)
  }, [])

  const emitDigitalPaymentMethod = useCallback((paymentMethod: string) => {
    if (!socketRef.current?.connected) return

    // CRITICAL FIX: Prevent re-emitting the same payment method
    if (lastPaymentMethodRef.current === paymentMethod) {
      console.log("Payment method unchanged, skipping emit")
      return
    }

    console.log("Emitting payment method:", paymentMethod)
    isEmittingPaymentRef.current = true
    lastPaymentMethodRef.current = paymentMethod

    // Update local state first
    setCartData((currentCartData: any) => {
      const updatedData = {
        cart: currentCartData?.cart || [],
        subtotal: currentCartData?.subtotal || 0,
        tax: currentCartData?.tax || 0,
        total: currentCartData?.total || 0,
        ...currentCartData,
        paymentMethod: paymentMethod,
      }

      return updatedData
    })

    const paymentUpdate = {
      paymentMethod: paymentMethod,
    }

    socketRef.current.emit("data-changes", paymentUpdate)

    setTimeout(() => {
      isEmittingPaymentRef.current = false
    }, 100)
  }, [])


  const resetAllData = useCallback(() => {
    console.log("Resetting all socket data")
    
    // Reset local state
    setCartData(null)
    
    // Reset refs
    isEmittingPaymentRef.current = false
    lastPaymentMethodRef.current = null
    
    // Emit reset to other clients
    if (socketRef.current?.connected) {
      socketRef.current.emit("data-changes", {
        cart: [],
        subtotal: 0,
        tax: 0,
        total: 0,
        paymentMethod: null
      })
    }
  }, [])

  return {
    isConnected,
    cartData,
    emitCartUpdate,
    emitDigitalPaymentMethod,
    resetAllData
  }
}