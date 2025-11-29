'use client'

import { jsPDF } from 'jspdf'
import { Download } from 'lucide-react'
import { formatCheckoutPrice } from '@/utils/formatPrice'
import Button from '@/_components/common/Button'

interface DownloadReceiptProps {
  transactionCode: string
  amount: string
  transactionUuid: string
  currency?: string
  quantity?: number
  paymentDate?: string
  paymentMethod?: string
}

export default function DownloadReceipt({
  transactionCode,
  amount,
  transactionUuid,
  currency = 'NPR',
  quantity = 1,
  paymentDate = new Date().toLocaleString('en-NP', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }),
  paymentMethod = 'eSewa',
}: DownloadReceiptProps) {
  const handleDownload = () => {
    const doc = new jsPDF()

    // Set colors matching app theme
    const primaryColor = [59, 47, 47] // Rich espresso brown #3B2F2F
    const secondaryColor = [212, 163, 115] // Warm tan #D4A373
    const textColor = [59, 47, 47] // Primary color for text
    const lightBorder = [199, 191, 179] // Border color #C7BFB3
    const backgroundColor = [250, 247, 242] // Background #FAF7F2

    // Add header background with gradient effect (primary to secondary)
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2])
    doc.rect(0, 0, 210, 35, 'F')

    // Add secondary color accent bar
    doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])
    doc.rect(0, 35, 210, 5, 'F')

    // Add logo/title
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(26)
    doc.setFont('helvetica', 'bold')
    doc.text('ThriftVerse', 105, 18, { align: 'center' })

    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    doc.text('Payment Receipt', 105, 28, { align: 'center' })

    // Reset text color
    doc.setTextColor(textColor[0], textColor[1], textColor[2])

    // Add payment success message
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])
    doc.text('Payment Successful!', 105, 55, { align: 'center' })

    // Reset text color
    doc.setTextColor(textColor[0], textColor[1], textColor[2])

    // Add horizontal line
    doc.setDrawColor(lightBorder[0], lightBorder[1], lightBorder[2])
    doc.setLineWidth(0.5)
    doc.line(20, 65, 190, 65)

    // Add payment details
    const startY = 80
    const lineHeight = 12
    let currentY = startY

    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')

    // Transaction details section
    doc.setFont('helvetica', 'bold')
    doc.text('Transaction Details', 20, currentY)
    currentY += lineHeight + 5

    // Transaction Code
    doc.setFont('helvetica', 'bold')
    doc.text('Transaction Code:', 20, currentY)
    doc.setFont('helvetica', 'normal')
    doc.text(transactionCode, 75, currentY)
    currentY += lineHeight

    // Transaction UUID
    doc.setFont('helvetica', 'bold')
    doc.text('Transaction UUID:', 20, currentY)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.text(transactionUuid, 75, currentY)
    doc.setFontSize(11)
    currentY += lineHeight

    // Payment Date
    doc.setFont('helvetica', 'bold')
    doc.text('Payment Date:', 20, currentY)
    doc.setFont('helvetica', 'normal')
    doc.text(paymentDate, 75, currentY)
    currentY += lineHeight

    // Payment Method
    doc.setFont('helvetica', 'bold')
    doc.text('Payment Method:', 20, currentY)
    doc.setFont('helvetica', 'normal')
    doc.text(paymentMethod, 75, currentY)
    currentY += lineHeight

    // Quantity
    doc.setFont('helvetica', 'bold')
    doc.text('Quantity:', 20, currentY)
    doc.setFont('helvetica', 'normal')
    doc.text(`${quantity} ${quantity === 1 ? 'item' : 'items'}`, 75, currentY)
    currentY += lineHeight + 10

    // Add horizontal line
    doc.line(20, currentY, 190, currentY)
    currentY += 10

    // Amount section with background
    doc.setFillColor(backgroundColor[0], backgroundColor[1], backgroundColor[2])
    doc.rect(20, currentY - 5, 170, 20, 'F')

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(14)
    doc.text('Amount Paid:', 25, currentY + 7)

    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])
    doc.setFontSize(18)
    doc.text(formatCheckoutPrice(parseFloat(amount), currency), 190, currentY + 7, { align: 'right' })

    // Reset text color
    doc.setTextColor(textColor[0], textColor[1], textColor[2])
    currentY += 30

    // Add footer with accent color
    const footerY = 270
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])
    doc.text('Thank you for shopping at ThriftVerse!', 105, footerY, {
      align: 'center',
    })

    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(lightBorder[0], lightBorder[1], lightBorder[2])
    doc.text(
      'This is a computer-generated receipt and does not require a signature.',
      105,
      footerY + 5,
      { align: 'center' }
    )

    // Save the PDF
    doc.save(`receipt_${transactionCode}.pdf`)
  }

  return (
    <Button
      onClick={handleDownload}
      variant="ghost"
      size="md"
      fullWidth
    >
      <Download className="h-4 w-4" strokeWidth={2} />
      Download Receipt
    </Button>
  )
}
