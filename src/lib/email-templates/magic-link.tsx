import * as React from 'react'

import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from '@react-email/components'

interface MagicLinkEmailProps {
  siteName: string
  token: string
}

export const MagicLinkEmail = ({
  siteName,
  token,
}: MagicLinkEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your six-digit verification code for {siteName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={eyebrow}>CLOVR HQ</Text>
        <Heading style={h1}>Verify it&apos;s you</Heading>
        <Text style={text}>
          Enter this six-digit code in the sign-in window. It expires shortly
          and can only be used once.
        </Text>
        <Text style={code}>{token}</Text>
        <Text style={footer}>
          If you didn&apos;t try to sign in to {siteName}, you can safely ignore this email.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default MagicLinkEmail

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { maxWidth: '520px', margin: '0 auto', padding: '48px 32px' }
const eyebrow = { color: '#c9252d', fontSize: '12px', fontWeight: 'bold' as const, letterSpacing: '2px', margin: '0 0 16px' }
const h1 = {
  fontSize: '28px',
  fontWeight: 'bold' as const,
  color: '#000000',
  margin: '0 0 20px',
}
const text = {
  fontSize: '14px',
  color: '#55575d',
  lineHeight: '1.5',
  margin: '0 0 25px',
}
const code = {
  backgroundColor: '#f5f5f5',
  border: '1px solid #e4e4e7',
  borderRadius: '8px',
  color: '#18181b',
  fontSize: '34px',
  fontWeight: 'bold' as const,
  letterSpacing: '10px',
  margin: '8px 0 28px',
  padding: '20px 22px',
  textAlign: 'center' as const,
}
const footer = { fontSize: '12px', color: '#999999', margin: '30px 0 0' }
