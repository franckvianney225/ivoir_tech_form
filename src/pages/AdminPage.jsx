import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import * as XLSX from 'xlsx'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'

export default function AdminPage() {
  const navigate = useNavigate()

  useEffect(() => {
    if (!localStorage.getItem('isAuthenticated')) {
      navigate('/login')
    }
  }, [navigate])
  const [activeTab, setActiveTab] = useState('statistiques')
  const [panelistes, setPanelistes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 50
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [panelisteToDelete, setPanelisteToDelete] = useState(null)

  useEffect(() => {
    const fetchPanelistes = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/panelistes`)
        if (!response.ok) throw new Error('Erreur de chargement')
        const data = await response.json()
        setPanelistes(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPanelistes()
  }, [])

  const exportToCSV = () => {
    const csvContent = [
      ['Nom', 'Email', 'Contact', 'Poste', 'Organisation', 'Domaines', 'Expérience'],
      ...panelistes.map(p => [
        `${p.prenom} ${p.nom}`,
        p.email,
        p.contact,
        p.poste,
        p.organisation,
        [...(typeof p.domaines === 'string' ? JSON.parse(p.domaines) : p.domaines), p.autre_domaine].filter(Boolean).join(', '),
        `${p.experience} ans`
      ])
    ].map(e => e.join(';')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'panelistes.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const exportToExcel = () => {
    const data = [
      ['Nom', 'Email', 'Contact', 'Poste', 'Organisation', 'Domaines', 'Expérience'],
      ...panelistes.map(p => [
        `${p.prenom} ${p.nom}`,
        p.email,
        p.contact,
        p.poste,
        p.organisation,
        [...(typeof p.domaines === 'string' ? JSON.parse(p.domaines) : p.domaines), p.autre_domaine].filter(Boolean).join(', '),
        `${p.experience} ans`
      ])
    ]

    const ws = XLSX.utils.aoa_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Panelistes')
    XLSX.writeFile(wb, 'panelistes.xlsx')
  }

  const handleDeleteClick = (paneliste) => {
    setPanelisteToDelete(paneliste)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/panelistes/${panelisteToDelete.id}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) throw new Error('Échec de la suppression')
      
      setPanelistes(panelistes.filter(p => p.id !== panelisteToDelete.id))
      setShowDeleteModal(false)
      setPanelisteToDelete(null)
    } catch (err) {
      console.error('Erreur:', err)
      setError(err.message)
    }
  }

  const exportToPDF = () => {
    const doc = new jsPDF()
    doc.text('Liste des Panelistes', 14, 16)
    
    const headers = [['Nom', 'Email', 'Contact', 'Poste', 'Organisation', 'Domaines', 'Expérience']]
    const data = panelistes.map(p => [
      `${p.prenom} ${p.nom}`,
      p.email,
      p.contact,
      p.poste,
      p.organisation,
      [...(typeof p.domaines === 'string' ? JSON.parse(p.domaines) : p.domaines), p.autre_domaine].filter(Boolean).join(', '),
      `${p.experience} ans`
    ])

    doc.autoTable({
      head: headers,
      body: data,
      startY: 20,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [22, 160, 133] }
    })
    doc.save('panelistes.pdf')
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="bg-gradient-to-b from-ivoirtech-green to-green-700 text-white w-64 flex flex-col shadow-xl">
        <div className="p-6">
          <div className="flex items-center space-x-3">
            <img 
              src="/logo/logo.jpeg" 
              alt="Logo" 
              className="h-10 w-10 rounded-full object-cover"
            />
            <h2 className="text-xl font-bold">Admin Panel</h2>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-2">
          <ul className="space-y-1">
            <li>
              <Link 
                to="#"
                className={`flex items-center px-4 py-3 rounded-lg transition-all ${
                  activeTab === 'statistiques' 
                    ? 'bg-white/20 text-white shadow-md' 
                    : 'hover:bg-white/10 text-white/90'
                }`}
                onClick={() => setActiveTab('statistiques')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Statistiques
              </Link>
            </li>
            <li>
              <Link 
                to="#"
                className={`flex items-center px-4 py-3 rounded-lg transition-all ${
                  activeTab === 'panelistes' 
                    ? 'bg-white/20 text-white shadow-md' 
                    : 'hover:bg-white/10 text-white/90'
                }`}
                onClick={() => setActiveTab('panelistes')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Panelistes
              </Link>
            </li>
          </ul>
        </nav>

        {/* Bouton Déconnexion */}
        <div className="p-4 border-t border-white/10">
          <button 
            onClick={() => {
              localStorage.removeItem('isAuthenticated')
              navigate('/login')
            }}
            className="flex items-center w-full px-4 py-3 text-white/90 hover:text-white rounded-lg hover:bg-white/10 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Déconnexion
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto">
        {activeTab === 'panelistes' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Liste des Panelistes</h1>
              <div className="flex space-x-2">
                <button 
                  onClick={exportToCSV}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm"
                >
                  Export CSV
                </button>
                <button 
                  onClick={exportToExcel}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
                >
                  Export Excel
                </button>
                <button 
                  onClick={exportToPDF}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
                >
                  Export PDF
                </button>
              </div>
            </div>
            
            {loading ? (
              <p>Chargement en cours...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden">
                  <thead className="bg-ivoirtech-green">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Nom et Prénoms</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Contact</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Poste</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Organisation</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Domaines</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Expérience</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {panelistes
                      .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                      .map((paneliste) => (
                      <tr key={paneliste.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {paneliste.nom} {paneliste.prenom} 
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {paneliste.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {paneliste.contact}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {paneliste.poste}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {paneliste.organisation}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {(() => {
                            try {
                              const domaines = typeof paneliste.domaines === 'string' 
                                ? JSON.parse(paneliste.domaines)
                                : paneliste.domaines;
                              
                              if (!Array.isArray(domaines)) {
                                return paneliste.domaines;
                              }

                              const displayedDomains = domaines.slice(0, 3);
                              const hasMore = domaines.length > 3;
                              
                              let result = displayedDomains.join(', ');
                              if (hasMore) {
                                result += `... (+${domaines.length - 3})`;
                              }
                              if (paneliste.autre_domaine) {
                                result += `, ${paneliste.autre_domaine}`;
                              }
                              return result;
                            } catch {
                              return paneliste.domaines;
                            }
                          })()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {paneliste.experience} ans
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap flex space-x-2">
                          <button 
                            disabled
                            className="bg-gray-400 text-white px-3 py-1 rounded-lg flex items-center space-x-1 transition-colors cursor-not-allowed"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                            <span className="text-xs">Modifier</span>
                          </button>
                          <button 
                            onClick={() => handleDeleteClick(paneliste)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg flex items-center space-x-1 transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <span className="text-xs">Supprimer</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination */}
                <div className="flex justify-between items-center mt-4 px-6 py-3 bg-gray-50">
                  <button 
                    onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
                  >
                    Précédent
                  </button>
                  
                  <span className="text-sm text-gray-600">
                    Page {currentPage} sur {Math.ceil(panelistes.length / itemsPerPage)}
                  </span>
                  
                  <button 
                    onClick={() => setCurrentPage(p => Math.min(p + 1, Math.ceil(panelistes.length / itemsPerPage)))}
                    disabled={currentPage === Math.ceil(panelistes.length / itemsPerPage) || panelistes.length === 0}
                    className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
                  >
                    Suivant
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'statistiques' && (
          <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-800">Tableau de Bord</h1>
            
            {/* Cartes Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Carte Nombre de panelistes */}
              <div className="bg-gradient-to-br from-ivoirtech-green to-green-600 p-6 rounded-xl shadow-lg text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium mb-1">Panelistes</h3>
                    <p className="text-4xl font-bold">{panelistes.length}</p>
                  </div>
                  <div className="bg-white/20 p-3 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <span>Total des inscriptions</span>
                </div>
              </div>

              {/* Carte Dernière inscription */}
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium mb-1">Dernier paneliste</h3>
                    {panelistes.length > 0 ? (
                      <p className="text-2xl font-bold">
                        {panelistes[panelistes.length - 1].nom} {panelistes[panelistes.length - 1].prenom} 
                      </p>
                    ) : (
                      <p className="text-xl font-medium">Aucune inscription</p>
                    )}
                  </div>
                  <div className="bg-white/20 p-3 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-4">
                  {panelistes.length > 0 && (
                    <p className="text-sm flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Inscrit aujourd'hui
                    </p>
                  )}
                </div>
              </div>

              {/* Carte Domaines */}
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl shadow-lg text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium mb-1">Domaines</h3>
                    <p className="text-4xl font-bold">
                      {new Set(panelistes.flatMap(p => 
                        typeof p.domaines === 'string' ? JSON.parse(p.domaines) : p.domaines
                      )).size}
                    </p>
                  </div>
                  <div className="bg-white/20 p-3 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <span>Domaines d'expertise</span>
                </div>
              </div>
            </div>

            {/* Graphiques */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Répartition par domaine */}
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">Répartition par domaine</h3>
                  <button className="text-ivoirtech-green hover:text-green-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                  </button>
                </div>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Graphique en cours de développement</p>
                </div>
              </div>

              {/* Inscriptions par mois */}
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">Inscriptions mensuelles</h3>
                  <button className="text-ivoirtech-green hover:text-green-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                  </button>
                </div>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Graphique en cours de développement</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de confirmation de suppression */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Confirmer la suppression</h3>
            <p>Êtes-vous sûr de vouloir supprimer {panelisteToDelete?.prenom} {panelisteToDelete?.nom} ?</p>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Annuler
              </button>
              <button 
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
