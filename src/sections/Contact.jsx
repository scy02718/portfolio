import React, { useRef, useState } from 'react'
import emailjs from '@emailjs/browser'
import Decoder from '../components/Decoder'

const Contact = () => {
    const formRef = useRef()
    const [form, setForm] = useState({ name: '', email: '', message: '' })
    const [loading, setLoading] = useState(false)

    const handleChange = ({ target: { name, value } }) => {
        setForm({ ...form, [name]: value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            await emailjs.send(
                'service_s7tu6kp',
                'template_rvqfsws',
                {
                    from_name: form.name,
                    to_name: 'Samuel',
                    from_email: form.email,
                    to_email: 'scy02718@gmail.com',
                    message: form.message,
                },
                'gcxq1edpVWZhSQFrV',
            )
            setLoading(false)
            alert('Message sent successfully!')
            setForm({ name: '', email: '', message: '' })
        } catch (error) {
            console.error(error)
            setLoading(false)
            alert('An error occurred. Please try again.')
        }
    }

    return (
        <section className='c-space my-4' id='contact'>
            <h3 className='head-text'>
                <Decoder text='Contact' />
            </h3>

            <p className='mt-3 text-xs text-green-200/70 font-mono leading-relaxed'>
                <span className='text-green-500/60'>$</span> echo "Drop a message — I read every one."
            </p>

            <form ref={formRef} onSubmit={handleSubmit} className='mt-4 space-y-4 font-mono text-xs'>
                <div className='space-y-1'>
                    <label className='field-label text-xs block'>name</label>
                    <input
                        type='text'
                        name='name'
                        value={form.name}
                        onChange={handleChange}
                        required
                        className='field-input min-h-10 text-xs'
                        placeholder='john doe'
                    />
                </div>
                <div className='space-y-1'>
                    <label className='field-label text-xs block'>email</label>
                    <input
                        type='email'
                        name='email'
                        value={form.email}
                        onChange={handleChange}
                        required
                        className='field-input min-h-10 text-xs'
                        placeholder='johndoe@gmail.com'
                    />
                </div>
                <div className='space-y-1'>
                    <label className='field-label text-xs block'>message</label>
                    <textarea
                        name='message'
                        value={form.message}
                        onChange={handleChange}
                        required
                        rows={4}
                        className='field-input min-h-10 text-xs'
                        placeholder="hi, I'm interested in..."
                    />
                </div>
                <button className='field-btn text-xs min-h-10' type='submit' disabled={loading}>
                    {loading ? '> sending...' : '> send'}
                </button>
            </form>
        </section>
    )
}

export default Contact
