import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function FormPage() {
  const [darkMode, setDarkMode] = useState(true)
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    contact: '',
    poste: '',
    organisation: '',
    domaines: [],
    autreDomaine: '',
    experience: '',
    photo: null
  })

  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    // Validation du champ experience
    if (!formData.experience || isNaN(formData.experience)) {
      setError('Veuillez entrer un nombre valide pour les années d\'expérience')
      return
    }
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/check-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email }),
      })

      const data = await response.json()
      
      if (data.exists) {
        setError('Cet email est déjà enregistré')
        return
      }

      const formDataToSend = new FormData()
      formDataToSend.append('nom', formData.nom)
      formDataToSend.append('prenom', formData.prenom)
      formDataToSend.append('email', formData.email)
      formDataToSend.append('contact', formData.contact)
      formDataToSend.append('poste', formData.poste)
      formDataToSend.append('organisation', formData.organisation)
      formDataToSend.append('domaines', JSON.stringify(formData.domaines))
      formDataToSend.append('autreDomaine', formData.autreDomaine)
      formDataToSend.append('experience', formData.experience)
      if (formData.photo) {
        formDataToSend.append('photo', formData.photo)
      }

      // Debug: Afficher le contenu de FormData
      for (const [key, value] of formDataToSend.entries()) {
        console.log(`${key}:`, value)
      }

      const submitResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/submit-form`, {
        method: 'POST',
        body: formDataToSend,
      })

      // Debug: Afficher la réponse complète du serveur
      if (!submitResponse.ok) {
        const errorResponse = await submitResponse.json().catch(() => ({}))
        console.error('Erreur du serveur:', {
          status: submitResponse.status,
          statusText: submitResponse.statusText,
          error: errorResponse
        })
      }

      if (submitResponse.ok) {
        setSuccess(true)
        setFormData({
          nom: '',
          prenom: '',
          email: '',
          contact: '',
          poste: '',
          organisation: '',
          domaines: [],
          autreDomaine: '',
          experience: ''
        })
      } else {
        setError('Erreur lors de la soumission du formulaire')
      }
    } catch (err) {
      setError(`Erreur de connexion au serveur: ${err.message}`)
    }
  }

  return (
    <div className={`min-h-screen py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-800 to-gray-900 text-gray-100' 
        : 'bg-[url(/background_1.png)] bg-cover bg-center bg-no-repeat text-gray-800'
    }`}>
      <div className="max-w-4xl mx-auto">
        {!success ? (
          <div className={`rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className={`bg-gradient-to-r ${
              darkMode ? 'from-green-800 to-green-900' : 'from-ivoirtech-green to-green-600'
            } text-white py-12 px-8 sm:px-10 lg:px-12 w-full relative overflow-hidden`}>
              {/* Fond décoratif en bas */}
              <div className="absolute -bottom-20 left-0 right-0 h-40 bg-gradient-to-t from-green-100 to-transparent opacity-30"></div>
              
              <div className="flex flex-col items-start space-y-4">
                <div>
                  <img 
                    src="/logo/logo.jpeg" 
                    alt="Logo Ministère" 
                    className="w-[220px] h-[130px] object-contain"
                  />
                </div>
                <div className="text-left">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                    FORMULAIRE D'INSCRIPTION DES PANELISTES (IVOIRTECH)
                  </h1>
                  <p>
                    Les informations fournies permettront de faire des slides de présentation du panéliste lors de son passage.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              {/* Question 1 - Nom */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  1. Nom <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={(e) => setFormData({...formData, nom: e.target.value})}
                  required
                  placeholder="Votre réponse ici..."
                  className={`w-full border-0 rounded-xl shadow-sm py-3 px-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-placeholder-orange focus:ring-opacity-50 transition-all duration-200 hover:shadow-md ${
                    darkMode 
                      ? 'bg-gray-700 text-gray-100' 
                      : 'bg-white/90 text-gray-800'
                  }`}
                />
              </div>

              {/* Question 2 - Prénom */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  2. Prénoms <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="prenom"
                  value={formData.prenom}
                  onChange={(e) => setFormData({...formData, prenom: e.target.value})}
                  required
                  placeholder="Votre réponse ici..."
                  className={`w-full border-0 rounded-xl shadow-sm py-3 px-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-placeholder-orange focus:ring-opacity-50 transition-all duration-200 hover:shadow-md ${
                    darkMode 
                      ? 'bg-gray-700 text-gray-100' 
                      : 'bg-white/90 text-gray-800'
                  }`}
                />
              </div>

              {/* Question 3 - Contact */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  3. Contact <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="contact"
                  value={formData.contact}
                  onChange={(e) => setFormData({...formData, contact: e.target.value})}
                  required
                  placeholder="Votre réponse ici..."
                  className={`w-full border-0 rounded-xl shadow-sm py-3 px-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-placeholder-orange focus:ring-opacity-50 transition-all duration-200 hover:shadow-md ${
                    darkMode 
                      ? 'bg-gray-700 text-gray-100' 
                      : 'bg-white/90 text-gray-800'
                  }`}
                />
              </div>

              {/* Question 4 - Email */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  4. e-mail <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  placeholder="Votre réponse ici..."
                  className={`w-full border-0 rounded-xl shadow-sm py-3 px-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-placeholder-orange focus:ring-opacity-50 transition-all duration-200 hover:shadow-md ${
                    darkMode 
                      ? 'bg-gray-700 text-gray-100' 
                      : 'bg-white/90 text-gray-800'
                  }`}
                />
              </div>

              {/* Question 5 - Poste */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  5. Poste occupé <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="poste"
                  value={formData.poste}
                  onChange={(e) => setFormData({...formData, poste: e.target.value})}
                  required
                  placeholder="Entrez votre réponse"
                  className={`w-full border-0 rounded-xl shadow-sm py-3 px-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ivoirtech-green focus:ring-opacity-50 transition-all duration-200 hover:shadow-md ${
                    darkMode 
                      ? 'bg-gray-700 text-gray-100' 
                      : 'bg-white/90 text-gray-800'
                  }`}
                />
              </div>

              {/* Question 6 - Organisation */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  6. Organisation/Structure/Institution <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="organisation"
                  value={formData.organisation}
                  onChange={(e) => setFormData({...formData, organisation: e.target.value})}
                  required
                  placeholder="Entrez votre réponse"
                  className={`w-full border-0 rounded-xl shadow-sm py-3 px-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ivoirtech-green focus:ring-opacity-50 transition-all duration-200 hover:shadow-md ${
                    darkMode 
                      ? 'bg-gray-700 text-gray-100' 
                      : 'bg-white/90 text-gray-800'
                  }`}
                />
              </div>

              {/* Question 7 - Domaines d'expertise */}
              <div>
                <label className={`block text-sm font-medium mb-4 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  7. Domaines d'expertise <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {['Économie', 'Environnement', 'Santé', 'Éducation', 'Technologies Numériques', 'Gouvernance/Politique', 'Autre'].map((domaine) => (
                    <div key={domaine} className="flex items-center">
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          id={`domaine-${domaine}`}
                          name="domaines"
                          value={domaine}
                          checked={formData.domaines.includes(domaine)}
                          onChange={(e) => {
                            const { value, checked } = e.target
                            setFormData(prev => ({
                              ...prev,
                              domaines: checked
                                ? [...prev.domaines, value]
                                : prev.domaines.filter(d => d !== value)
                            }))
                          }}
                          className="sr-only peer"
                        />
                        <div className="w-5 h-5 border-2 border-gray-300 rounded flex items-center justify-center peer-checked:bg-ivoirtech-green peer-checked:border-ivoirtech-green transition-colors">
                          <svg className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                      <label htmlFor={`domaine-${domaine}`} className={`ml-3 block text-sm ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {domaine}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Champ conditionnel pour "Autre" */}
              {formData.domaines.includes('Autre') && (
                <div className={`ml-4 pl-4 border-l-2 ${
                  darkMode ? 'border-green-800' : 'border-green-200'
                }`}>
                  <label className={`block text-sm font-medium mb-2 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Si vous avez choisi (Autre), merci d'indiquer
                  </label>
                  <input
                    type="text"
                    name="autreDomaine"
                    value={formData.autreDomaine}
                    onChange={(e) => setFormData({...formData, autreDomaine: e.target.value})}
                    placeholder="Spécifiez votre domaine"
                  className={`w-full border-0 rounded-xl shadow-sm py-3 px-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ivoirtech-green focus:ring-opacity-50 transition-all duration-200 hover:shadow-md ${
                    darkMode 
                      ? 'bg-gray-700 text-gray-100' 
                      : 'bg-white/90 text-gray-800'
                  }`}
                  />
                </div>
              )}

              {/* Question 8 - Expérience */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  8. Année d'expérience dans le domaine <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={(e) => setFormData({...formData, experience: e.target.value})}
                  required
                  min="0"
                  placeholder="Entrez votre réponse"
                  className={`w-full border-0 rounded-xl shadow-sm py-3 px-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ivoirtech-green focus:ring-opacity-50 transition-all duration-200 hover:shadow-md ${
                    darkMode 
                      ? 'bg-gray-700 text-gray-100' 
                      : 'bg-white/90 text-gray-800'
                  }`}
                />
              </div>

              {/* Question 9 - Photo */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  9. Photo (JPEG/PNG) <span className="text-red-500">*</span>
                </label>
                <div 
                  className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                    darkMode 
                      ? 'border-gray-600 hover:border-gray-500 bg-gray-800/50' 
                      : 'border-gray-300 hover:border-gray-400 bg-white/90'
                  }`}
                  onClick={() => document.getElementById('photo-upload').click()}
                >
                  <input
                    id="photo-upload"
                    type="file"
                    name="photo"
                    accept=".jpg,.jpeg,.png"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file && file.size > 5 * 1024 * 1024) {
                        setError('La photo ne doit pas dépasser 5MB');
                      } else {
                        setFormData({...formData, photo: file});
                        setError('');
                      }
                    }}
                    required
                    className="hidden"
                  />
                  {formData.photo ? (
                    <div className="flex flex-col items-center">
                      <img 
                        src={URL.createObjectURL(formData.photo)} 
                        alt="Aperçu" 
                        className="max-h-48 rounded-lg mb-2"
                      />
                      <p className="text-sm text-green-600">{formData.photo.name}</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className={`mt-2 text-sm ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Cliquez pour sélectionner ou glissez-déposez une photo
                      </p>
                      <p className={`text-xs ${
                        darkMode ? 'text-gray-500' : 'text-gray-400'
                      }`}>
                        Formats acceptés: JPEG, PNG (max 5MB)
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {error && (
                <div className={`p-4 border rounded-lg ${
                  darkMode 
                    ? 'bg-red-900/30 border-red-700 text-red-300' 
                    : 'bg-red-50 border-red-200 text-red-700'
                }`}>
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-6 flex justify-center">
                <button
                  onClick={handleSubmit}
                  className="px-8 py-3 bg-gradient-to-r from-ivoirtech-green to-green-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transform transition-all duration-300 hover:scale-[1.02]"
                >
                  Envoyer
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
                <div className={`rounded-xl shadow-lg overflow-hidden p-8 text-center w-full max-w-md ${
                  darkMode ? 'bg-gray-800' : 'bg-white'
                }`}>
              <div className="flex justify-center mb-4">
                <svg className="h-12 w-12 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-green-700 mb-2">Formulaire soumis avec succès!</h2>
              <p className={`text-lg ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>Un email de confirmation a été envoyé.</p>
            </div>
          </div>
        )}

        {!success && (
           <div className="text-center mt-8 text-gray-500 text-sm">
            <div className="max-w-6xl mx-auto text-center text-gray-500 text-sm">
              <p>Ministère de la Transition Numérique et de la Digitalisation</p>
              <p className="mt-2">BY-DSI MTND</p>
              <Link 
                to="/admin" 
                className="mt-4 inline-block text-ivoirtech-green hover:underline"
              >
                Accès Admin
              </Link>
            </div>
          </div>
        )}

        {/* Flèche de retour en haut */}
        <div className="fixed bottom-8 right-1/2 translate-x-1/2">
          <button 
            onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
            className="p-3 bg-ivoirtech-green text-white rounded-full shadow-lg hover:bg-green-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Bouton flottant mode nuit */}
      <button 
        onClick={() => setDarkMode(!darkMode)}
        className="fixed bottom-6 right-6 bg-ivoirtech-green text-white p-3 rounded-full shadow-xl hover:shadow-2xl transition-all z-50"
      >
        {darkMode ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        )}
      </button>
    </div>
  )
}
