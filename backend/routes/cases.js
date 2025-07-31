const express = require('express');
const router = express.Router();
const { verifyJWT, requireRole } = require('../middleware/auth');

// Get user cases
router.get('/user', verifyJWT, requireRole(['user']), (req, res) => {
  // Mock user cases data
  const userCases = [
    {
      id: 'CASE001',
      title: 'Property Dispute - Apartment 4B',
      type: 'Property',
      status: 'In Progress',
      filedDate: '2024-01-15',
      nextHearing: '2024-02-20',
      description: 'Dispute over apartment ownership and maintenance charges'
    },
    {
      id: 'CASE002',
      title: 'Loan Recovery - Personal Loan',
      type: 'Financial',
      status: 'Pending',
      filedDate: '2024-01-10',
      nextHearing: '2024-02-15',
      description: 'Recovery of personal loan amount with interest'
    },
    {
      id: 'CASE003',
      title: 'Family Property Division',
      type: 'Family',
      status: 'Completed',
      filedDate: '2023-12-01',
      nextHearing: null,
      description: 'Division of ancestral property among siblings'
    }
  ];
  
  res.json(userCases);
});

// Get court cases
router.get('/court', verifyJWT, requireRole(['court']), (req, res) => {
  // Mock court cases data
  const courtCases = [
    {
      id: 'CASE001',
      title: 'Property Dispute - Apartment 4B',
      petitioner: 'John Doe',
      respondent: 'Jane Smith',
      type: 'Property',
      status: 'Under Review',
      filedDate: '2024-01-15',
      nextHearing: '2024-02-20',
      priority: 'High'
    },
    {
      id: 'CASE002',
      title: 'Loan Recovery - Personal Loan',
      petitioner: 'ABC Bank',
      respondent: 'Mike Johnson',
      type: 'Financial',
      status: 'Scheduled',
      filedDate: '2024-01-10',
      nextHearing: '2024-02-15',
      priority: 'Medium'
    },
    {
      id: 'CASE003',
      title: 'Family Property Division',
      petitioner: 'Sarah Wilson',
      respondent: 'David Wilson',
      type: 'Family',
      status: 'Mediation',
      filedDate: '2023-12-01',
      nextHearing: '2024-02-10',
      priority: 'Low'
    }
  ];
  
  res.json(courtCases);
});

// Get case details by ID
router.get('/:caseId', verifyJWT, (req, res) => {
  const { caseId } = req.params;
  
  // Mock case details
  const caseDetails = {
    id: caseId,
    title: 'Property Dispute - Apartment 4B',
    type: 'Property',
    status: 'In Progress',
    filedDate: '2024-01-15',
    nextHearing: '2024-02-20',
    description: 'Dispute over apartment ownership and maintenance charges',
    documents: [
      { name: 'Complaint.pdf', type: 'Complaint', uploaded: '2024-01-15' },
      { name: 'Evidence.pdf', type: 'Evidence', uploaded: '2024-01-20' }
    ],
    timeline: [
      { date: '2024-01-15', event: 'Case Filed', description: 'Initial complaint submitted' },
      { date: '2024-01-20', event: 'Evidence Submitted', description: 'Supporting documents uploaded' },
      { date: '2024-02-01', event: 'First Hearing', description: 'Preliminary hearing scheduled' }
    ]
  };
  
  res.json(caseDetails);
});

module.exports = router; 