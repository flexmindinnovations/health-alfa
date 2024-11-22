import React, { useState } from 'react';
import { TextInput, Group, Text, Button, useMantineTheme } from '@mantine/core';
import classes from '@styles/Input.module.css';

export function OtpInput({ length = 4 }) {
  const [otp, setOtp] = useState(Array(length).fill(''));
  const [isValid, setIsValid] = useState(true);
  const [disableSubmit, setDisableSubmit] = useState(true);
  const [error, setError] = useState('');
  const theme = useMantineTheme();

  // Handle OTP input change
  const handleChange = (e, index) => {
    const value = e.target.value;

    // Ensure the input is a number and has length 1
    if (!/^\d?$/.test(value)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to the next input if the current one is filled
    if (value && index < length - 1) {
      setTimeout(() => {
        document.getElementById(`otp-input-${index + 1}`).focus();
      }, 10); // Use setTimeout to allow DOM updates before focusing
    }
    // If the current input is cleared, move focus to the previous input and select the text
    else if (!value && index > 0) {
      setTimeout(() => {
        const prevInput = document.getElementById(`otp-input-${index - 1}`);
        prevInput.focus();
        prevInput.select(); // Select the text so the user can start typing immediately
      }, 10); // Use setTimeout for DOM updates
    }

    // Enable submit button if all fields are filled
    const inputValues = newOtp.filter(val => val);
    if (inputValues.length === length) {
      setDisableSubmit(false);
    } else {
      setDisableSubmit(true);
    }

    setIsValid(true);
    setError('');
  };

  // Handle form submission (example: validate OTP)
  const handleSubmit = () => {
    const otpValue = otp.join('');
    if (otpValue.length !== length) {
      setIsValid(false);
      setError(`OTP must be ${length} digits.`);
      return;
    }

    if (!/^\d+$/.test(otpValue)) { // Ensure the OTP contains only digits
      setIsValid(false);
      setError('OTP must only contain numbers.');
      return;
    }

    alert(`OTP Submitted: ${otpValue}`);
  };

  return (
    <div>
      <Group>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            id={`otp-input-${index}`}
            value={digit}
            onChange={e => handleChange(e, index)}
            maxLength={1}
            style={{ width: 40, textAlign: 'center' }}
            error={!isValid}
            type="tel"
            inputMode="numeric"
          />
        ))}
      </Group>

      {!isValid && (
        <Text className={classes.inputError} fz={theme.fontSizes.xs} mt="xs">
          {error}
        </Text>
      )}

      <Button onClick={handleSubmit} disabled={disableSubmit} mt="md">
        Submit OTP
      </Button>
    </div>
  );
}
