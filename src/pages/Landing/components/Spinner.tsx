import React from 'react'
import ClipLoader from "react-spinners/ClipLoader";

function Spinner() {
    return (

        <div className='flex w-full h-screen justify-center items-center'>
            <ClipLoader
                color={'#038477'}
                loading={true}
                // cssOverride={override}
                size={150}
                aria-label="Loading Spinner"
                data-testid="loader"
            />
        </div>
    )
}

export default Spinner