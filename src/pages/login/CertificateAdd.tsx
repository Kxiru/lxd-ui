import type { FC } from "react";
import {
  Accordion,
  CodeSnippet,
  Col,
  Notification,
  Row,
  useNotify,
} from "@canonical/react-components";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "context/auth";
import Loader from "components/Loader";
import CertificateAddForm from "pages/login/CertificateAddForm";
import NotificationRow from "components/NotificationRow";
import CustomLayout from "components/CustomLayout";
import { useSettings } from "context/useSettings";

const CertificateAdd: FC = () => {
  const { isAuthenticated, isAuthLoading } = useAuth();
  const notify = useNotify();
  const { data: settings } = useSettings();
  const hasCertificate = settings?.client_certificate;
  const navigate = useNavigate();

  if (isAuthLoading) {
    return <Loader isMainComponent />;
  }

  if (isAuthenticated) {
    return <Navigate to="/ui" replace={true} />;
  }

  return (
    <CustomLayout mainClassName="certificate-generate">
      <Row>
        <Col size={2} />
        <Col size={8}>
          {notify.notification ? (
            <NotificationRow />
          ) : (
            <Row>
              <Notification title="Trust token" severity="information">
                In order for your browser certificate to be added to the
                server’s trust store, you must present a trust token generated
                by the server.
              </Notification>
              {hasCertificate === false && (
                <Notification
                  severity="caution"
                  title="Missing client certificate"
                  actions={[
                    {
                      label: "Go back to step 1",
                      onClick: () => {
                        navigate("/ui/login/certificate-generate");
                      },
                    },
                  ]}
                >
                  You are missing an installed client certificate. You may not
                  be able to authenticate.
                </Notification>
              )}
            </Row>
          )}
          <div className="p-stepped-list__content">
            <div>
              Run the following command on the LXD server to create a new
              identity and generate a trust token.
            </div>
            <CodeSnippet
              className="u-no-margin--bottom"
              blocks={[
                {
                  code: `lxc auth identity create tls/lxd-ui --group admin`,
                  wrapLines: true,
                },
              ]}
            />
            <div>
              You can replace <code>lxd-ui</code> with the name you want to give
              to the identity.
            </div>
          </div>

          <div className="p-stepped-list__content">
            <br />
            <CertificateAddForm />
          </div>

          <Accordion
            sections={[
              {
                title: (
                  <>
                    If you encounter:{" "}
                    <code>
                      Failed to create pending TLS identity: One or more groups
                      were not found: &apos;admin&apos;.
                    </code>
                  </>
                ),
                content: (
                  <>
                    <div>
                      Older versions of LXD are not pre-configured with an admin
                      group. To create one, run the following commands. Then,
                      try the first step again.
                    </div>
                    <CodeSnippet
                      blocks={[
                        {
                          code: `# Create a group called admin. \nlxc auth group create admin`,
                          wrapLines: true,
                        },
                        {
                          code: `# Assign admin permissions to the admin group.\nlxc auth group permission add admin server admin`,
                          wrapLines: true,
                        },
                      ]}
                    />
                  </>
                ),
              },
            ]}
          />
        </Col>
      </Row>
    </CustomLayout>
  );
};

export default CertificateAdd;
