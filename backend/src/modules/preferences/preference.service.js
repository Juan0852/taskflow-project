import { PreferenceMapper } from './preference.mapper.js';
import { PreferenceRepository } from './preference.repository.js';

async function getOrCreatePreference(userId) {
    const existingPreference = await PreferenceRepository.findByUserId(userId);

    if (existingPreference) {
        return existingPreference;
    }

    return PreferenceRepository.createForUser(userId);
}

export const PreferenceService = {
    async getPreferences(userId) {
        const preference = await getOrCreatePreference(userId);
        return PreferenceMapper.toResponseDTO(preference);
    },

    async updatePreferences(userId, payload) {
        const currentPreference = await getOrCreatePreference(userId);
        const updateData = PreferenceMapper.toUpdateEntity(payload, currentPreference);
        const updatedPreference = await PreferenceRepository.updateByUserId(userId, updateData);
        return PreferenceMapper.toResponseDTO(updatedPreference);
    }
};
