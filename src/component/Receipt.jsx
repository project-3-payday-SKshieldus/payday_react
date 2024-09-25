import PropTypes from 'prop-types';
import './Receipt.css';

const Receipt = ({ children, explanation }) => {
  return (
    <div className="receipt">
      <h1 className='app-name'>PayDay</h1>
      {explanation && <p className='explanation'>{explanation}</p>}
      <hr></hr>
      {children}
    </div>
  );
};

Receipt.propTypes = {
    children: PropTypes.node, 
    explanation: PropTypes.string,
  };
  Receipt.defaultProps = {
    explanation: null,
  };

export default Receipt;

