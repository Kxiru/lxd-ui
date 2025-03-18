import { handleResponse } from "util/helpers";
import type { LxdApiResponse } from "types/apiResponse";
import type { LxdCertificate } from "types/certificate";

export const fetchCertificates = async (): Promise<LxdCertificate[]> => {
  return new Promise((resolve, reject) => {
    fetch("/1.0/certificates?recursion=1")
      .then(handleResponse)
      .then((data: LxdApiResponse<LxdCertificate[]>) => {
        resolve(data.metadata);
      })
      .catch(reject);
  });
};

export const addCertificate = async (token: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    fetch(`/1.0/auth/identities/tls`, {
      method: "POST",
      body: JSON.stringify({
        trust_token: token,
      }),
    })
      .then(handleResponse)
      .then(resolve)
      .catch(reject);
  });
};
