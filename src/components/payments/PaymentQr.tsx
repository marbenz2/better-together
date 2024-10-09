import QRCode from 'react-qr-code'

type BasePaymentQrProps = {
  amount: number
  currency?: string
}

type IbanPaymentQrProps = BasePaymentQrProps & {
  type: 'iban'
  iban: string
  bic?: string
  recipient: string
  purpose?: string
}

type PaypalPaymentQrProps = BasePaymentQrProps & {
  type: 'paypal'
  email: string
  purpose: string
}

type PaymentQrProps = IbanPaymentQrProps | PaypalPaymentQrProps

export default function PaymentQr(props: PaymentQrProps) {
  const { type, amount, currency = 'EUR' } = props
  let qrData = ''

  if (type === 'iban') {
    const { iban, bic, recipient, purpose } = props
    // EPC QR Code Format (Girocode)
    qrData = [
      'BCD',
      '002',
      '2',
      'SCT',
      bic || '',
      recipient.substring(0, 70),
      iban.replace(/\s/g, ''),
      currency + amount.toFixed(2),
      '',
      '',
      purpose,
      '',
    ].join('\n')
  } else if (type === 'paypal') {
    const { email, purpose } = props
    const baseUrl = 'https://www.paypal.com/paypalme/'
    qrData = `${baseUrl}${encodeURIComponent(email)}/${amount}${currency}?description=${encodeURIComponent(purpose)}`
  }

  return <QRCode value={qrData} size={256} />
}
