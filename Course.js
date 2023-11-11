import React, { useState, useEffect } from 'react';

import { Form, Button, Table, Badge,Modal, Dropdown, } from 'react-bootstrap';

const App = () => {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [amountPaid, setAmountPaid] = useState();

  const [invoiceId, setInvoiceId] = useState('');
  const [data, setData] = useState([]);

  const CourseInvoiceSystem = () => {
    const courses = [
      { id: 1, name: 'FULL STACK', amount: 5000},
      { id: 2, name: 'JAVASCRIPT', amount: 3000 },
      { id: 3, name: 'FRONTEND', amount: 2000 },
    ];


  
    const calculateTotalAmount = () => {
      return selectedCourses.reduce((total, course) => total + course.amount, 0);
    };
  
    const calculateRemainingAmount = () => {
      return calculateTotalAmount() - amountPaid;
    };
  
    const handleDropdownChange = (e) => {
      const courseId = parseInt(e.target.value, 10);
      const selectedCourse = courses.find((course) => course.id === courseId);
  
      if (selectedCourse) {
        setSelectedCourses((prevSelected) => [...prevSelected, selectedCourse]);
      }
    };
  
    const handleAmountPaidChange = (e) => {
      const newAmountPaid = parseFloat(e.target.value);
      setAmountPaid(isNaN(newAmountPaid) ? 0 : newAmountPaid);
    };
  
    const handleDeleteCourse = (courseId) => {
      setSelectedCourses((prevSelected) => prevSelected.filter((course) => course.id !== courseId));
    };
  
    const handlePaymentStatus = () => {
      const remainingAmount = calculateRemainingAmount();
  
      if (amountPaid === 0) {
        return <Badge bg="danger">Unpaid</Badge>;
      } else if (remainingAmount === 0) {
        return <Badge bg="success">Paid</Badge>;
      } else {
        return (
          <Badge bg="warning">
            Partially Paid (Remaining: Rs: {remainingAmount})
          </Badge>
        );
      }
    };
  
    const handlePaymentSubmit = () => {
      // Handle payment logic here
      console.log('Payment submitted:', {

        selectedCourses,
        amountPaid,
        totalAmount: calculateTotalAmount(),
        paymentStatus: handlePaymentStatus(),
      });
    };
  };



  const generateInvoiceId = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (`0${currentDate.getMonth() + 1}`).slice(-2);
    const day = (`0${currentDate.getDate()}`).slice(-2);
    const hours = (`0${currentDate.getHours()}`).slice(-2);
    const minutes = (`0${currentDate.getMinutes()}`).slice(-2);
    const seconds = (`0${currentDate.getSeconds()}`).slice(-2);

    setInvoiceId(`${year}${month}${day}_${hours}${minutes}${seconds}`);
  };

  const handleSubmit = () => {
    handlePayment();

    const newData = {
      name,
      email,
      address,
      invoiceId,
      date: new Date().toLocaleDateString(),
      course: selectedCourses,
     
    };

    setData([...data, newData]);
    localStorage.setItem('invoiceData', JSON.stringify([...data, newData]));

    handleClose();
  };

  useEffect(() => {
    const storedData = localStorage.getItem('invoiceData');
    if (storedData) {
      setData(JSON.parse(storedData));
    }
  }, []);

  return (
    <div>
      <Button variant="primary" onClick={() => { generateInvoiceId(); handleShow(); }}>
        Open Popup
      </Button>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Invoice Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="address">
              <Form.Label>Address</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter your address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </Form.Group>



            <Form.Group controlId="courseDropdown">
          <Form.Label>Select Courses:</Form.Label>
          <Form.Select onChange={handleDropdownChange} multiple>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name} - Rs: {course.amount}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Table striped bordered hover>
        <thead>
          <tr>
            <th>Course</th>
            <th>Amount</th>
            <th>Action</th>
          </tr>
        </thead>
        <br></br>
        <tbody>
          {selectedCourses.map((course) => (
            <tr key={course.id}>
              <td>{course.name}</td>
              <td>Rs: {course.amount}</td>
              <td>
                <Button variant="danger" onClick={() => handleDeleteCourse(course.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
          <br></br>
        </tbody>
      </Table>
      <strong>Total Amount: Rs: {calculateTotalAmount()}</strong>
      <Form>
        <Form.Group controlId="amountPaid">
          <Form.Label>Amount Paid:</Form.Label>
          <Form.Control
            type="number"
            value={amountPaid}
            onChange={handleAmountPaidChange}
          />
        </Form.Group>
        <br></br>
        <div>{handlePaymentStatus()}</div>
        <br></br>

        </Form>
      </Form>
      </Modal.Body>


             
      <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
</Modal>


        {/* <Button variant="primary" onClick={handlePaymentSubmit}>
          Submit Payment
        </Button> */}
        
      


      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Address</th>
            <th>Invoice ID</th>
            <th>Date</th>
            {/* <th>Course</th>
            <th>Amount</th>
            <th>Status</th> */}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td>{item.email}</td>
              <td>{item.address}</td>
              <td>{item.invoiceId}</td>
              <td>{item.date}</td>
              {/* <td>{item.course}</td>
              <td>{`$${item.amount}`}</td>
              <td>{item.status}</td> */}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default App;


