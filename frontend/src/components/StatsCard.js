import React from 'react';
import { Card } from 'react-bootstrap';
import { BarChart, ArrowUp, ArrowDown } from 'react-bootstrap-icons';

const StatsCard = ({ title, value, change, icon }) => {
  const isPositive = change >= 0;
  
  return (
    <Card className="border-0 shadow-sm h-100">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h6 className="text-muted mb-2">{title}</h6>
            <h3 className="mb-0">{value}</h3>
          </div>
          <div className={`p-2 rounded ${isPositive ? 'bg-success bg-opacity-10' : 'bg-danger bg-opacity-10'}`}>
            {icon || <BarChart size={20} className={isPositive ? 'text-success' : 'text-danger'} />}
          </div>
        </div>
        <div className={`mt-3 d-flex align-items-center ${isPositive ? 'text-success' : 'text-danger'}`}>
          {isPositive ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
          <small className="ms-1">{Math.abs(change)}% {isPositive ? 'increase' : 'decrease'} from last week</small>
        </div>
      </Card.Body>
    </Card>
  );
};

export default StatsCard;