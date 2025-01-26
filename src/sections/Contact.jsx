import React, { useState, useRef } from 'react'
import emailjs from '@emailjs/browser'

const Contact = () => {
    // This ref will reference the form, and will be used to interact with the form
    const formRef = useRef();

    // This state will store the form data
    const [form, setForm] = useState({
        name: '',
        email: '',
        message: ''
    })

    // This state will store loading information when submitting the form
    const [loading, setLoading] = useState(false)

    // This is a handler that will be called when the form is changed
    // The handleChange is called for EVERY change in input field, meaning we have to write code that will update the changed field only
    // We first destructure the input changes, by its name and value
    // For example, when changing the name input, the name will be 'name' and the value will be the new value of the input
    const handleChange = ({ target : { name, value }}) => {
        // We update the form state, by spreading the current form state, and updating the changed field
        // ..form = Spread the current form state
        // [name] = Update the field with the name of the input
        // value = Update the field with the new value of the input
        // Hence, the state of the element
        setForm({
            ...form,
            [name]: value
        })
    }

    // This is a handler that will be called when the form is submitted
    // To implement the email send functionality, we will use a service called EmailJS
    // First went to emailjs.com and signed up for an account, and register a new Gmail service
    // After authenticating my Gmail account, create a new template for the email
    // This function will get event as a parameter, which indicates the form submission event
    const handleSubmit = async (e) => {
        // Normally this would refresh the page, but we don't want that as this is a single page application
        // So we prevent the default behavior of the form
        e.preventDefault()
        
        // Since we start the send process, we set the loading state to true
        setLoading(true)

        try {
            // We use the EmailJS service to send the email
            // We need to provide the service ID, template ID, and the data to send
            // The data required are sender name, receiver name, sender email, receiver email, and the message
            // These are contained within the form data, input them as template param
            await emailjs.send(
                'service_s7tu6kp', // The service ID
                'template_rvqfsws', // The template ID
                {
                    from_name: form.name, // The name of the sender
                    to_name: 'Samuel', // The name of the receiver
                    from_email: form.email, // The email of the sender
                    to_email: 'scy02718@gmail.com', // The email of the receiver
                    message: form.message // The message of the sender 
                },
                'gcxq1edpVWZhSQFrV', // public API key
            )

            // After sending the email, reset the form state
            setLoading(false)

            alert('Message sent successfully!')

            // Reset the form state
            setForm({
                name: '',
                email: '',
                message: ''
            })
        } catch (error) {
            // If there is an error, log the error
            console.error(error)
            // Set the loading state to false
            setLoading(false)
            // Alert the user that there was an error
            alert('An error occurred. Please try again.')
        }

    }

    //service_s7tu6kp

    return (
        // c-space is a custom class that adds padding to the top and bottom of the section, my-20 adds margin to the top and bottom
        // The id of contact allows any link with href="#contact" to scroll to this section
        <section className='c-space my-20' id="contact">
            {/* Relative means the element is positioned relative to its normal position */}
            {/* min-h-screen makes sure the section is at least the height of the screen */}
            {/* flex + items-center + justify-center + flex-col makes sure the children are in a column and centered */}
            {/* To be specific, items-center centers the children horizontally, and justify-center centers the children vertically */}
            <div className='relative min-h-screen flex items-center justify-center flex-col'>
                {/* The terminal background */}
                {/* absolute means the element is positioned relative to the nearest positioned ancestor */}
                {/* inset-0 means the element is positioned at the top, right, bottom, and left */}
                {/* min-h-screen makes sure the element is at least the height of the screen */}
                <img src="/assets/terminal.png" alt="Terminal Background" className='absolute inset-0 min-h-screen' />
                <div className='contact-container'>
                    <h3 className='head-text'>Let's Talk</h3>
                    <p className='text-lg text-white-600 mt-3'>Whether you're looking to build a new software, improve your existing platform, bring a unique project to life, or just chat with me, I'm here to help!</p>

                    {/* To interact with the form, we need a Ref that points to the form, as well as a state and a handler */}
                    {/* After defining the useRef and the handlers, set up the form */}
                    {/* space-y-7 = Space between the children is 7 */}
                    <form ref={formRef} onSubmit={handleSubmit} className='mt-12 flex flex-col space-y-7'>
                        {/* The label. space y-3 = Space between the children is 3 */}
                        <label className='space-y-3'>
                            {/* Span is a simple css tag that is used to style the text */}
                            <span className='field-label'>Full Name</span>
                            {/* 사용되는 값은 form 이라는 state 이다 */}
                            {/* type='text' = The input type is text */}
                            {/* name='name' = The input name is name */}
                            {/* value={form.name} = The value of the input is the name in the form state */}
                            {/* onChange={handleChange} = When the input changes, the handleChange function is called */}
                            {/* required = The input is required */}
                            {/* className='field-input' = Custom class for styling */}
                            {/* placeholder = Placeholder text */}
                            <input 
                                type='text'
                                name='name'
                                value={form.name}
                                onChange={handleChange}
                                required
                                className='field-input'
                                placeholder= "John Doe"
                            />
                        </label>
                        <label className='space-y-3'>
                            {/* Span is a simple css tag that is used to style the text */}
                            <span className='field-label'>Email</span>
                            {/* 사용되는 값은 form 이라는 state 이다 */}
                            <input 
                                type='email'
                                name='email'
                                value={form.email}
                                onChange={handleChange}
                                required
                                className='field-input'
                                placeholder= "johndoe@gmail.com"
                            />
                        </label>
                        <label className='space-y-3'>
                            {/* Span is a simple css tag that is used to style the text */}
                            <span className='field-label'>Your Message</span>
                            {/* 사용되는 값은 form 이라는 state 이다 */}
                            {/* textarea 는 여러줄의 텍스트를 입력할 수 있는 입력 필드를 생성한다 */}
                            {/* rows={5} = The input has 5 rows */}
                            <textarea 
                                name='message'
                                value={form.message}
                                onChange={handleChange}
                                required
                                rows={5}
                                className='field-input'
                                placeholder= "Hi, I'm interested in..."
                            />
                        </label>

                        {/* The button */}
                        {/* type='submit' = The button type is submit */}
                        {/* disabled={loading} = If loading is true, the button is disabled */}
                        {/* The text of the button is dynamic, depending on the loading state */}
                        <button className='field-btn' type="submit" disabled={loading}>
                            {loading ? 'Sending...' : 'Send Message'}

                            <img src="/assets/arrow-up.png" alt='arrow-up' className='field-btn_arrow' />
                        </button>
                    </form>
                </div>
            </div>
        </section>
    )
}

export default Contact