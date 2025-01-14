import { FC, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { LxdInstance } from "types/instance";
import RenameHeader, { RenameHeaderValues } from "components/RenameHeader";
import { renameInstance } from "api/instances";
import InstanceStateActions from "pages/instances/actions/InstanceStateActions";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useEventQueue } from "context/eventQueue";
import { useToastNotification } from "context/toastNotificationProvider";
import {
  instanceLinkFromOperation,
  instanceNameValidation,
} from "util/instances";
import { getInstanceName } from "util/operations";
import InstanceDetailActions from "./InstanceDetailActions";
import InstanceLinkChip from "./InstanceLinkChip";

interface Props {
  name: string;
  instance?: LxdInstance;
  project: string;
  isLoading: boolean;
}

const InstanceDetailHeader: FC<Props> = ({
  name,
  instance,
  project,
  isLoading,
}) => {
  const eventQueue = useEventQueue();
  const navigate = useNavigate();
  const toastNotify = useToastNotification();
  const controllerState = useState<AbortController | null>(null);

  const RenameSchema = Yup.object().shape({
    name: instanceNameValidation(project, controllerState, name).required(
      "Instance name is required",
    ),
  });

  const formik = useFormik<RenameHeaderValues>({
    initialValues: {
      name,
      isRenaming: false,
    },
    validationSchema: RenameSchema,
    onSubmit: (values) => {
      if (name === values.name) {
        void formik.setFieldValue("isRenaming", false);
        formik.setSubmitting(false);
        return;
      }
      void renameInstance(name, values.name, project)
        .then((operation) => {
          const instanceLink = (
            <InstanceLinkChip
              instance={{
                name: values.name,
                project: project,
                type: instance?.type || "instance",
              }}
            />
          );
          eventQueue.set(
            operation.metadata.id,
            () => {
              void navigate(`/ui/project/${project}/instance/${values.name}`);
              toastNotify.success(
                <>
                  Instance{" "}
                  <strong>{getInstanceName(operation.metadata)}</strong> renamed
                  to {instanceLink}.
                </>,
              );
              void formik.setFieldValue("isRenaming", false);
            },
            (msg) =>
              toastNotify.failure(
                "Renaming instance failed.",
                new Error(msg),
                instanceLinkFromOperation({
                  operation,
                  project,
                  instanceType: instance?.type || "instance",
                }),
              ),
            () => formik.setSubmitting(false),
          );
        })
        .catch((e) => {
          formik.setSubmitting(false);
          toastNotify.failure(
            `Renaming instance failed.`,
            e,
            instance && <InstanceLinkChip instance={instance} />,
          );
        });
    },
  });

  return (
    !isLoading && (
      <RenameHeader
        name={name}
        titleClassName="instance-detail-title"
        parentItems={[
          <Link to={`/ui/project/${project}/instances`} key={1}>
            Instances
          </Link>,
        ]}
        renameDisabledReason={
          !instance
            ? "Invalid Instance: Cannot be renamed"
            : instance?.status !== "Stopped"
              ? "Stop the instance to rename"
              : undefined
        }
        centerControls={
          instance ? (
            <div>
              <i className="status u-text--muted">{instance.status}</i>
              <InstanceStateActions key="state" instance={instance} />
            </div>
          ) : null
        }
        controls={
          instance ? (
            <InstanceDetailActions
              instance={instance}
              project={project}
              isLoading={isLoading}
            />
          ) : null
        }
        isLoaded={Boolean(instance)}
        formik={formik}
      />
    )
  );
};

export default InstanceDetailHeader;
