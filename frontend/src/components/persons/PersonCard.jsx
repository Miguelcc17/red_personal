import React from 'react';
import { Mail, Phone, MapPin, Briefcase } from 'lucide-react';

const PersonCard = ({ person, onDelete }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{person.nombre} {person.apellido}</h3>
          <p className="text-indigo-600 font-medium">{person.profesion}</p>
        </div>
        <button
          onClick={() => onDelete(person.id)}
          className="text-red-500 hover:text-red-700 text-sm"
        >
          Delete
        </button>
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center space-x-2">
          <Mail size={16} />
          <span>{person.email}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Phone size={16} />
          <span>{person.telefono}</span>
        </div>
        <div className="flex items-center space-x-2">
          <MapPin size={16} />
          <span>{person.ciudad}, {person.pais}</span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {person.intereses && person.intereses.map((int, i) => (
          <span key={i} className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md text-xs font-medium">
            {int}
          </span>
        ))}
      </div>
    </div>
  );
};

export default PersonCard;
