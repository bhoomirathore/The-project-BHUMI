// Appointment Service

import apiClient, { isMockMode } from '../api/client';
import mockStore from '../api/mock/store';
import { getSROOffices, getSROOfficesByDistrict } from '../api/mock/locations';

export const appointmentService = {
  getOffices() {
    return getSROOffices();
  },

  getOfficesByDistrict(district) {
    return getSROOfficesByDistrict(district);
  },

  async bookAppointment(applicationId, { office, date, slot }) {
    if (isMockMode()) {
      return await mockStore.bookAppointment(applicationId, { office, date, slot });
    }
    // TODO(api-contract): path not yet defined in docs
    return await apiClient.post(`/applications/${encodeURIComponent(applicationId)}/appointment`, {
      office,
      date,
      slot,
    });
  },

  async createAppointment(data) {
    if (isMockMode()) {
      return await mockStore.createAppointment(data);
    }
    // TODO(api-contract): path not yet defined in docs
    return await apiClient.post('/appointments', data);
  },

  async getUserAppointments(userId) {
    if (isMockMode()) {
      return await mockStore.getUserAppointments(userId);
    }
    // TODO(api-contract): path not yet defined in docs
    return await apiClient.get(`/appointments?userId=${encodeURIComponent(userId)}`);
  },

  async getSlotAvailability(office, date) {
    if (isMockMode()) {
      return mockStore.getSlotAvailability(office, date);
    }
    // TODO(api-contract): path not yet defined in docs
    return await apiClient.get(
      `/appointments/slots?office=${encodeURIComponent(office)}&date=${encodeURIComponent(date)}`
    );
  },
};

export default appointmentService;
