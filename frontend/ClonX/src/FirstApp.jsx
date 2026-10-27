import  PropTypes from 'prop-types'
 
 export const FirstApp = ({title, subtitle}) => {

    // console.log(props)

    if (!title){
        throw new Error('El title no existe')
    }

     return(
        <>
        <h1>{ title }</h1>
        {/* <code>{ JSON.stringify(newMessage) }</code> */}
        <p>{subtitle}</p>
        </>
    )


   
}



FirstApp.propTypes = {
    title: PropTypes.string.isRequired,
}