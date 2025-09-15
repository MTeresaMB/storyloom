import { useState } from "react";
import { Character } from "../../types/character";

interface CharacterFormProps {
  onCharacterCreated: (character: Character) => void;
}

export default function CharacterForm({ onCharacterCreated }: CharacterFormProps) {
  const [formData, setFormData] = useState<Character>({
    id: '',
    name: '',
    description: '',
    age: 0,
    appearance: '',
    personality: '',
    background: '',
    goals: '',
    conflicts: '',
    user_id: '',
    created_at: '',
    updated_at: '',
  })

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/characters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'dac6f4fa-6baf-4966-8d3c-597c1f3afa5e' //temporal
        },
        body: JSON.stringify({...formData, age: formData.age ? formData.age : undefined})
      })

      if(response.ok) {
        const newCharacter = await response.json();
        onCharacterCreated(newCharacter);
        setFormData({
          id: '',
          name: '',
          description: '',
          age: 0,
          appearance: '',
          personality: '',
          background: '',
          goals: '',
          conflicts: '',
          user_id: '',
          created_at: '',
          updated_at: '',
        })
      }
    } catch (error) {
      console.error('Error creating character:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div>Creando personaje...</div>

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
    <h3>Crear Nuevo Personaje</h3>
    
    <div style={{ marginBottom: 10 }}>
      <label>Nombre *</label>
      <input
        type="text"
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
        required
        style={{ width: '100%', padding: 8 }}
      />
    </div>

    <div style={{ marginBottom: 10 }}>
      <label>Descripción</label>
      <textarea
        value={formData.description}
        onChange={(e) => setFormData({...formData, description: e.target.value})}
        style={{ width: '100%', padding: 8, height: 60 }}
      />
    </div>

    <div style={{ marginBottom: 10 }}>
      <label>Edad</label>
      <input
        type="number"
        value={formData.age}
        onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
        style={{ width: '100%', padding: 8 }}
      />
    </div>

    <button type="submit" disabled={loading} style={{ padding: 10, backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: 4 }}>
      {loading ? 'Creando...' : 'Crear Personaje'}
    </button>
  </form>  )
}
