import image from '../../images/mountain.svg'

const BackgroundImage = () => {
  return (
    <img src={image} alt='background' style={{ height: '100vh', width: '100vw', postition: 'absolute', objectFit: 'cover', objectPosition: 'center' }}/>
  )
}

export default BackgroundImage