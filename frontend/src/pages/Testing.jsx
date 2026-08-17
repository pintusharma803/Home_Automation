import React, { useState } from 'react'

const Testing = () => {

    const [formData, setFormData] = useState({ name: '', mobile: '',email:''});
     function handleChange(e){
        setFormData({...formData,[e.target.name]:e.target.value});
    }

    const [deviceData, setdeviceData] = useState({ room: '', control: '',state:'',controller:''});
     function handleSubmit(e){
        setFormData({...deviceData,[e.target.name]:e.target.value});
    }

    return (
        <div>
            <div>
                <input name='name' type="text" value={formData.name } onChange={handleChange } placeholder='Enter name' />
                <input name='mobile' type="text" value={formData.mobile } onChange={handleChange } placeholder='Enter mobile' />
                <input name='email' type="text" value={ formData.email} onChange={handleChange} placeholder='Enter email' />
            </div>

            <div>
                <input name='room' type="text" value={ deviceData.room} onChange={ handleDevice} placeholder='Enter Room name' />
                <input name='control' type="text" value={deviceData.control } onChange={handleDevice } placeholder='Enter control type ' />
                <input name='state' type="text" value={deviceData.state } onChange={ handleDevice} placeholder='Enter state' />
                <input name='controller' type="text" value={deviceData.controller} onChange={ handleDevice} placeholder='Enter controller name' />
            </div>
        </div>
    )
}

export default Testing
