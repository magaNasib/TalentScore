const Free = () => {
  return (
    <div className='premium'>
      <h2 className='premium-header'>Upgrade</h2>
      <h2 className='premium-header'>to the paid report</h2>
      <h2 className='premium-title'>Get your Premium Report</h2>
      <div className='premium-text'>
        <p>Your Premium report will provide tailored suggestions for fields that align with your strengths and interests, guiding you towards your ideal career.</p>
        <p>Upgrade to the paid report for verified certificates,AI career advice, personalized chatbot support, and more.</p>
        <p>Get ready to unlock your true potential and pave your path to success!</p>
      </div>
      <div className='premium-offer'>
        <h2 className='offer-title'>You will get in the Premium report</h2>
        <div className='offer-text-div'>
          <p className='offer-text'>
            <i className='fa-solid fa-check offer-check'></i>
            Verified certification
          </p>
          <p className='offer-text'>
            <i className='fa-solid fa-check offer-check'></i>
            Career planning          
          </p>
          <p className='offer-text'>
            <i className='fa-solid fa-check offer-check'></i>
            Job fit assesment
          </p>
          <p className='offer-text'>
            <i className='fa-solid fa-check offer-check'></i>
            Talent bot
          </p>
          <p className='offer-text'>
            <i className='fa-solid fa-check offer-check'></i>
            Professional development guide
          </p>
          <p className='offer-text'>
            <i className='fa-solid fa-check offer-check'></i>
            ...          
          </p>
        </div>
        <button className='offer-button'>See the Premium report features and prices</button>
      </div>
    </div>
  )
}

export default Free