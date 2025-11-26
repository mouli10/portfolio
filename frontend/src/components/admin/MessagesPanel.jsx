import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaEnvelope, FaEnvelopeOpen, FaTrash, FaCheck, FaTimes } from 'react-icons/fa'
import axios from 'axios'

const MessagesPanel = ({ onStatsUpdate }) => {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [filter, setFilter] = useState('all') // all, unread, read

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await axios.get('/api/admin/messages', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setMessages(response.data)
      setLoading(false)
      if (onStatsUpdate) onStatsUpdate()
    } catch (error) {
      console.error('Error fetching messages:', error)
      setLoading(false)
    }
  }

  const markAsRead = async (messageId) => {
    try {
      const token = localStorage.getItem('adminToken')
      await axios.patch(`/api/admin/messages/${messageId}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchMessages()
    } catch (error) {
      console.error('Error marking message as read:', error)
    }
  }

  const deleteMessage = async (messageId) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return

    try {
      const token = localStorage.getItem('adminToken')
      await axios.delete(`/api/admin/messages/${messageId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setSelectedMessage(null)
      fetchMessages()
    } catch (error) {
      console.error('Error deleting message:', error)
    }
  }

  const filteredMessages = messages.filter(msg => {
    if (filter === 'unread') return !msg.read
    if (filter === 'read') return msg.read
    return true
  })

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
        <p className="text-gray-400 mt-4">Loading messages...</p>
      </div>
    )
  }

  return (
    <div>
      {/* Header with Filter */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-white">Contact Messages</h2>
        <div className="flex gap-2">
          {['all', 'unread', 'read'].map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-4 py-2 rounded-lg font-semibold capitalize transition-all ${filter === filterType
                ? 'bg-primary-500 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
            >
              {filterType}
            </button>
          ))}
        </div>
      </div>

      {filteredMessages.length === 0 ? (
        <div className="text-center py-12 bg-gray-800 rounded-lg">
          <FaEnvelope className="text-gray-600 text-6xl mx-auto mb-4" />
          <p className="text-gray-400">No messages found</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Messages List */}
          <div className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
            {filteredMessages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedMessage(message)}
                className={`bg-gray-800 p-4 rounded-lg cursor-pointer transition-all ${selectedMessage?.id === message.id
                  ? 'ring-2 ring-primary-500'
                  : 'hover:bg-gray-700'
                  } ${!message.read ? 'border-l-4 border-primary-500' : ''}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {message.read ? (
                      <FaEnvelopeOpen className="text-gray-500" />
                    ) : (
                      <FaEnvelope className="text-primary-400" />
                    )}
                    <h3 className="font-semibold text-white">{message.name}</h3>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(message.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mb-1">{message.email}</p>
                <p className="text-sm text-gray-500 mt-2 line-clamp-2">{message.message}</p>
              </motion.div>
            ))}
          </div>

          {/* Message Detail View */}
          <div className="bg-gray-800 rounded-lg p-6 sticky top-24">
            {selectedMessage ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedMessage.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">Message Details</h3>
                    <button
                      onClick={() => setSelectedMessage(null)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <FaTimes size={20} />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-400">From</label>
                      <p className="text-white font-semibold">{selectedMessage.name}</p>
                    </div>

                    <div>
                      <label className="text-sm text-gray-400">Email</label>
                      <a
                        href={`mailto:${selectedMessage.email}`}
                        className="text-primary-400 hover:text-primary-300 font-semibold block"
                      >
                        {selectedMessage.email}
                      </a>
                    </div>



                    <div>
                      <label className="text-sm text-gray-400">Received</label>
                      <p className="text-white">
                        {new Date(selectedMessage.timestamp).toLocaleString()}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm text-gray-400">Status</label>
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${selectedMessage.read
                        ? 'bg-gray-700 text-gray-300'
                        : 'bg-primary-500/20 text-primary-400'
                        }`}>
                        {selectedMessage.read ? 'Read' : 'Unread'}
                      </span>
                    </div>

                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Message</label>
                      <div className="bg-gray-700 p-4 rounded-lg">
                        <p className="text-gray-300 whitespace-pre-wrap">{selectedMessage.message}</p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                      {!selectedMessage.read && (
                        <button
                          onClick={() => markAsRead(selectedMessage.id)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-all"
                        >
                          <FaCheck /> Mark as Read
                        </button>
                      )}
                      <a
                        href={`mailto:${selectedMessage.email}`}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all"
                      >
                        <FaEnvelope /> Reply
                      </a>
                      <button
                        onClick={() => deleteMessage(selectedMessage.id)}
                        className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="text-center py-12">
                <FaEnvelope className="text-gray-600 text-6xl mx-auto mb-4" />
                <p className="text-gray-400">Select a message to view details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default MessagesPanel

