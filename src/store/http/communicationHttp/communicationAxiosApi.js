import { getAuthToken } from "../../../util/sessionStorage";
import { Method } from "./communicationMethod";

const token = getAuthToken();

const communicationBaseUrl = '/api/communication';

const communicationAxiosApi = {
    addCommunication(data) {
        try {
            const form = new FormData();

            form.append('id', data.id ? data.id : 0);
            form.append('title', data.title);
            form.append('body', data.body);
            form.append('author', data.author ? data.author : 'World sport action');
            form.append('expiryDate', data.expiryDate);
            form.append('expiryDate', data.expiryDate);
            form.append('organisationId', data.organisationId);
            form.append('toOrganisationIds', data.toOrganisationIds);
            form.append('toUserRoleIds', data.toUserRoleIds);
            form.append('toUserIds', data.toUserIds);

            if (data.communicationImage) {
                form.append('communicationImage', data.communicationImage);
            }

            if (data.communicationVideo) {
                form.append('communicationVideo', data.communicationVideo);
            }

            if (data.mediaArray !== []) {
                for (let i = 0; i < data.mediaArray.length; i++) {
                    form.append('communicationMedia', data.mediaArray[i]);
                }
            }

            return Method.dataPost(communicationBaseUrl, token, form);
        } catch (e) {
            console.error(e);
        }
    },
    communicationList(userId) {
        try {
            const url = `${communicationBaseUrl}/admin?userId=${userId}`;
            return Method.dataGet(url, token);
        } catch (e) {
            console.error(e);
        }
    },
};

export default communicationAxiosApi;
