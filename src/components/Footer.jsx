import barcode from '../image/barcode.png';

const Footer = () => {
    return (
        <div style={{
            position: 'fixed',
            left: '50%',
            bottom: 0,
            transform: 'translateX(-50%)',
            width: '100%',
            maxWidth: '550px',
            height: 'auto',
            overflow: 'hidden',
            boxSizing: 'border-box',
        }}>
            <div style={{
                textAlign: 'center',
            }}>
                <hr style={{ margin: '0', padding: '0' }} />
                <img src={barcode} alt="Barcode" style={{ margin: '10px 0 0 0', padding: '0', width: '90%' }} />
            </div>
        </div>
    );
}

export default Footer;
