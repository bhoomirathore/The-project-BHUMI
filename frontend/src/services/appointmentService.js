// Appointment Service

import apiClient, { isMockMode } from '../api/client';
import mockStore from '../api/mock/store';
import { getSROOffices } from '../api/mock/locations';

export const appointmentService = {
  getOffices() {
    return getSROOffices();
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
};

export default appointmentService;
