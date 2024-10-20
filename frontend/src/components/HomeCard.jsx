const HomeCard = () => {
    const styles = {
      homeCard: {
        display: 'flex',
        justifyContent: 'space-between',
        backgroundColor: '#3d3d3d',
        borderRadius: '18px 0px 0px 18px', // Round the left corners only, 
        width: '100%',
        maxWidth: '1200px',
        height: '550px',
        margin: '30px auto',
      },
      cardText: {
        flex: 1, // Take up 50% of the card width
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center', // Center text vertically
        alignItems: 'center', // Center text horizontally
        textAlign: 'center',
        padding: '0 30px',
        background: 'linear-gradient(125deg, #AEACAF 0%, #5D595E 100%)',
        borderRadius: '18px 0px 0px 18px', // Round the left corners of the text section
      },
      cardImage: {
        flex: 1, // Take up 50% of the card width
        height: '100%',
        objectFit: 'cover',
        borderRadius: '0px 18px 18px 0px', // Round the right corners only
      },
      h2: {
        fontSize: '48px', 
        marginBottom: '15px',
        fontFamily: 'Rosarivo, serif',
        color: '#FCFCFC', 
      },
      p: {
        fontSize: '32px', 
        marginBottom: '30px',
        fontFamily: 'Rosarivo, serif',
        color: '#D7D5D7',
      },
      button: {
        padding: '12px 30px',
        backgroundColor: 'transparent',
        border: '2px solid #FCFCFC',
        color: '#FCFCFC',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '18px', 
        transition: 'background-color 0.3s ease, color 0.3s ease',
      },
      buttonHover: {
        backgroundColor: '#FCFCFC',
        color: '#3d3d3d',
      },
    };
  
    return (
      <div style={styles.homeCard}>
        {/* Left side for the text */}
        <div style={styles.cardText}>
          <h2 style={styles.h2}>Placeholder Title Goes Here</h2>
          <p style={styles.p}>Through Month 13, 2024</p>
          <button
            style={styles.button}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#FCFCFC';
              e.currentTarget.style.color = '#3d3d3d';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#FCFCFC';
            }}
          >
            Explore Card
          </button>
        </div>
  
        {/* Right side for the image */}
        <div>
          <img
            style={styles.cardImage}
            src="https://placehold.jp/500x500.png"
            alt="Placeholder"
          />
        </div>
      </div>
    );
  };
  
  export default HomeCard;
  