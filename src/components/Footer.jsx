import barcode from '../image/barcode.png';

const Footer = () => {
    return (
        <div style={{
            textAlign: 'center',
            position: 'fixed', 
            left: 0,           
            bottom: 0,         
            width: '100%',      
        }}>
            <div style={{
                width: '600px', 
                margin: '0 auto', 
            }}>
                <hr style={{ margin: '0', padding: '0' }} />
                <img src={barcode} alt="Barcode" style={{ margin: '0', padding: '0', width: '90%' }} />
            </div>
        </div>
    )
}

export default Footer;
