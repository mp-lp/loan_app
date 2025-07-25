import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from 'react-router-dom';

export default function ApplicationForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    loanAmount: '',
    loanTenure: '',
    employmentStatus: '',
    loanReason: '',
    employmentAddress1: '',
    employmentAddress2: '',
    termsAccepted: false,
    consent: false,
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.loanAmount || formData.loanAmount <= 0) newErrors.loanAmount = 'Enter a valid loan amount';
    if (!formData.loanTenure || formData.loanTenure <= 0) newErrors.loanTenure = 'Enter a valid tenure';
    if (!formData.employmentStatus.trim()) newErrors.employmentStatus = 'Employment status required';
    if (!formData.loanReason.trim()) newErrors.loanReason = 'Reason required';
    if (!formData.employmentAddress1.trim()) newErrors.employmentAddress1 = 'Employment address required';
    if (!formData.termsAccepted) newErrors.termsAccepted = 'Accept the terms';
    if (!formData.consent) newErrors.consent = 'Provide consent';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    if (errors[id]) setErrors(prev => ({ ...prev, [id]: undefined }));
  };

  const handleCheckboxChange = (id) => {
    setFormData(prev => ({ ...prev, [id]: !prev[id] }));
    if (errors[id]) setErrors(prev => ({ ...prev, [id]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/loans/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Submission failed');
      setFormData({
        fullName: '', loanAmount: '', loanTenure: '',
        employmentStatus: '', loanReason: '',
        employmentAddress1: '', employmentAddress2: '',
        termsAccepted: false, consent: false
      });
      navigate('/loans');
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
          <span className="text-lg font-bold text-green-700">CREDIT APP</span>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto py-8 px-4">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-black">APPLY FOR A LOAN</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full name as it appears on bank account</Label>
                  <Input
                    id="fullName"
                    placeholder="Full name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={`bg-gray-100 ${errors.fullName ? 'border-red-500' : ''}`}
                  />
                  {errors.fullName && <p className="text-sm text-red-500">{errors.fullName}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="loanAmount">How much do you need?</Label>
                  <Input
                    id="loanAmount"
                    type="number"
                    placeholder="Loan amount"
                    value={formData.loanAmount}
                    onChange={handleInputChange}
                    className={`bg-gray-100 ${errors.loanAmount ? 'border-red-500' : ''}`}
                  />
                  {errors.loanAmount && <p className="text-sm text-red-500">{errors.loanAmount}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="loanTenure">Loan tenure (in months)</Label>
                  <Input
                    id="loanTenure"
                    type="number"
                    placeholder="Tenure"
                    value={formData.loanTenure}
                    onChange={handleInputChange}
                    className={`bg-gray-100 ${errors.loanTenure ? 'border-red-500' : ''}`}
                  />
                  {errors.loanTenure && <p className="text-sm text-red-500">{errors.loanTenure}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="employmentStatus">Employment status</Label>
                  <Input
                    id="employmentStatus"
                    placeholder="Employment status"
                    value={formData.employmentStatus}
                    onChange={handleInputChange}
                    className={`bg-gray-100 ${errors.employmentStatus ? 'border-red-500' : ''}`}
                  />
                  {errors.employmentStatus && <p className="text-sm text-red-500">{errors.employmentStatus}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="loanReason">Reason for loan</Label>
                  <Textarea
                    id="loanReason"
                    placeholder="Reason"
                    value={formData.loanReason}
                    onChange={handleInputChange}
                    className={`bg-gray-100 ${errors.loanReason ? 'border-red-500' : ''}`}
                  />
                  {errors.loanReason && <p className="text-sm text-red-500">{errors.loanReason}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="employmentAddress1">Employment address</Label>
                  <Input
                    id="employmentAddress1"
                    placeholder="Address"
                    value={formData.employmentAddress1}
                    onChange={handleInputChange}
                    className={`bg-gray-100 ${errors.employmentAddress1 ? 'border-red-500' : ''}`}
                  />
                  {errors.employmentAddress1 && <p className="text-sm text-red-500">{errors.employmentAddress1}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="employmentAddress2">Employment address</Label>
                  <Input
                    id="employmentAddress2"
                    placeholder="Address"
                    value={formData.employmentAddress2}
                    onChange={handleInputChange}
                    className="bg-gray-100"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <div className="flex items-start space-x-2">
                  <Checkbox id="termsAccepted" checked={formData.termsAccepted} onCheckedChange={() => handleCheckboxChange('termsAccepted')} />
                  <Label htmlFor="termsAccepted" className={`text-sm ${errors.termsAccepted ? 'text-red-500' : ''}`}>
                    I have read the important information and accept that by completing the application I will be bound by the terms
                  </Label>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox id="consent" checked={formData.consent} onCheckedChange={() => handleCheckboxChange('consent')} />
                  <Label htmlFor="consent" className={`text-sm ${errors.consent ? 'text-red-500' : ''}`}>
                    Any personal and credit information obtained may be disclosed from time to time to other lenders, credit bureaus or other credit reporting agencies.
                  </Label>
                </div>
              </div>

              <Button type="submit" disabled={isLoading} className="w-full bg-green-700 hover:bg-green-800">
                {isLoading ? 'Submitting...' : 'Submit'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Chart Placeholder */}
        <div className="mt-6 text-gray-400 text-center text-sm">
          Chart (placeholder)
        </div>
      </main>
    </div>
  );
}
