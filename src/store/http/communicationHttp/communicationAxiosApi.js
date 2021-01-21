import { getAuthToken } from "../../../util/sessionStorage";
import { Method } from "./communicationMethod";

const token = getAuthToken();

const communicationAxiosApi = {
    addCommunication(data) {
        const form = new FormData();

        form.append('id', data.newsId ? data.newsId : 0);
        form.append('title', data.editData.title);
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
                form.append('newsMedia', data.mediaArry[i]);
            }
        }

        const url = '/communication';

        return Method.dataPost(url, token, form);
    },
};

export default communicationAxiosApi;
