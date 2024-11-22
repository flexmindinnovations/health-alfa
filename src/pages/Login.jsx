import styles from '../styles/login.module.css'
import { useForm } from '@mantine/form'
import { Button, Card, Text, useMantineTheme, Divider } from '@mantine/core'
import { useState, useEffect } from 'react'
import http from '@hooks/axios-instance.js'
import { useApiConfig } from '@contexts/ApiConfigContext.jsx'
import toast from 'react-hot-toast'
import { Lock } from 'lucide-react'
import { motion, useInView } from 'framer-motion'
import { GlobalPhoneInput } from '@components/PhoneInput'
import { debounce } from 'underscore'
import { OtpInput } from '@components/OTPInput'
import { zodResolver } from 'mantine-form-zod-resolver'
import { z } from 'zod'

export default function Login () {
  const { ref, inView } = useInView({
    threshold: 0.4
  })
  const [isPhoneVerified, setIsPhoneVerified] = useState(false)
  const [isValidNumber, setIsValidNumber] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isOtpSent, setIsOtpSent] = useState(false)
  const [apiState, setApiState] = useState('primary')
  const [otp, setOtp] = useState('')
  const theme = useMantineTheme()
  const apiConfig = useApiConfig()

  const handlePhoneNumberChange = data => {
    const { value, isValidNumber } = data
    setIsValidNumber(isValidNumber)
    setPhoneNumber(value)
  }

  const handleCountryChange = e => {
    setSelectedCountry(e)
  }

  const verifyPhoneNumber = async () => {
    setIsLoading(true)
    const phoneData = form.values.phoneNumber
    const payload = {
      country: phoneData.country,
      phone: phoneData.value
    }

    try {
      const response = await http.post(apiConfig.user.verifyPhone, payload)
      if (response.data && response.data.isRegistered) {
        setIsPhoneVerified(true) // Phone is verified, show OTP input
        toast.success('Phone number verified! Please enter OTP.')
      } else {
        toast.error('Phone number not registered.')
        setIsPhoneVerified(false)
      }
    } catch (error) {
      toast.error('Error verifying phone number.')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle OTP sending after phone verification
  const sendOtp = async () => {
    setIsLoading(true)
    const phoneData = form.values.phoneNumber
    const payload = {
      country: phoneData.country,
      phone: phoneData.value
    }

    try {
      const response = await http.post(apiConfig.user.sendOtp, payload)
      if (response.data && response.data.otpSent) {
        setIsOtpSent(true) // OTP sent successfully
        toast.success('OTP sent to your phone.')
      } else {
        toast.error('Failed to send OTP.')
      }
    } catch (error) {
      toast.error('Error sending OTP.')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle OTP form submission
  const handleOtpSubmit = () => {
    if (otp.length === 6) {
      alert('OTP Submitted: ' + otp)
    } else {
      toast.error('Please enter a valid 6-digit OTP.')
    }
  }

  return (
    <div className={styles.loginPage}>
      <div className={styles.overlay}>
        <motion.div
          layout
          ref={ref}
          animate={{ height: 'auto' }}
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.5 }}
          variants={{
            visible: { opacity: 1, scale: 1 },
            hidden: { opacity: 0, scale: 0.9 }
          }}
          style={{ overflow: 'hidden' }}
        >
          <Card p={theme.spacing.xl} className='min-h-80' radius={'lg'}>
            <Card.Section p={theme.spacing.sm}>
              <Text align='center' fz={'h3'} fw={'bold'}>
                Welcome Back!
              </Text>
              <Text fz={'h5'}>Enter Your Phone Number to Get OTP</Text>
            </Card.Section>
            <Card.Section>
                <Divider/>
            </Card.Section>
            <Card.Section p={theme.spacing.sm} className='flex-1 !flex items-center justify-center'>
              <form
                onSubmit={e => {
                  e.preventDefault()
                  if (!isPhoneVerified) {
                    verifyPhoneNumber()
                  } else if (!isOtpSent) {
                    sendOtp()
                  } else {
                    handleOtpSubmit()
                  }
                }}
                className='flex flex-1 flex-col h-full w-full justify-center items-center space-y-6'
              >
                {!isPhoneVerified && (
                  <GlobalPhoneInput
                    defaultValue={'IN'}
                    label='Phone Number'
                    onChange={data => handlePhoneNumberChange(data)}
                  />
                )}

                {/* OTP Input */}
                {isPhoneVerified && isOtpSent && (
                  <>
                    <OtpInput length={6} onChange={setOtp} />{' '}
                    {/* OTP Input Component */}
                    <Button
                      variant='solid'
                      radius='md'
                      fullWidth
                      size='md'
                      color={apiState}
                      type='submit'
                      loading={isLoading}
                    >
                      Submit OTP
                    </Button>
                  </>
                )}

                <Button
                  variant='solid'
                  radius='md'
                  fullWidth
                  size='md'
                  color={apiState}
                  type='submit'
                  loading={isLoading}
                  disabled={!isValidNumber}
                >
                  Get OTP
                </Button>
              </form>
            </Card.Section>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
