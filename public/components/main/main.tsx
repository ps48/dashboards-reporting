/*
 * SPDX-License-Identifier: Apache-2.0
 *
 * The OpenSearch Contributors require contributions made to
 * this file be licensed under the Apache-2.0 license or a
 * compatible open source license.
 *
 * Modifications Copyright OpenSearch Contributors. See
 * GitHub history for details.
 */

/*
 * Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * or in the "license" file accompanying this file. This file is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

import React, { Fragment, useState, useEffect } from 'react';
import { i18n } from '@osd/i18n';
import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiButton,
  EuiTitle,
  // @ts-ignore
  EuiHorizontalRule,
  EuiSpacer,
  EuiPanel,
  EuiGlobalToastList,
} from '@elastic/eui';
import { ReportsTable } from './reports_table';
import { ReportDefinitions } from './report_definitions_table';
import {
  addReportsTableContent,
  addReportDefinitionsTableContent,
} from './main_utils';
import CSS from 'csstype';
import {
  permissionsMissingToast,
  permissionsMissingActions,
} from '../utils/utils';

const reportCountStyles: CSS.Properties = {
  color: 'gray',
  display: 'inline',
};

export function Main(props) {
  const [reportsTableContent, setReportsTableContent] = useState([]);
  const [
    reportDefinitionsTableContent,
    setReportDefinitionsTableContent,
  ] = useState([]);
  const [toasts, setToasts] = useState([]);

  const addPermissionsMissingDownloadToastHandler = () => {
    const toast = permissionsMissingToast(
      permissionsMissingActions.GENERATING_REPORT
    );
    setToasts(toasts.concat(toast));
  };

  const handlePermissionsMissingDownloadToast = () => {
    addPermissionsMissingDownloadToastHandler();
  };

  const addReportsTableContentErrorToastHandler = (errorType: string) => {
    let toast = {};
    if (errorType === 'permissions') {
      toast = permissionsMissingToast(
        permissionsMissingActions.LOADING_REPORTS_TABLE
      );
    } else if (errorType === 'API') {
      toast = {
        title: i18n.translate(
          'opensearch.reports.main.errorGeneratingReportsTable.',
          { defaultMessage: 'Error generating reports table.' }
        ),
        color: 'danger',
        iconType: 'alert',
        id: 'reportsTableErrorToast',
      };
    }
    setToasts(toasts.concat(toast));
  };

  const handleReportsTableErrorToast = (errorType: string) => {
    addReportsTableContentErrorToastHandler(errorType);
  };

  const addReportDefinitionsTableErrorToastHandler = (errorType: string) => {
    let toast = {};
    if (errorType === 'permissions') {
      toast = permissionsMissingToast(
        permissionsMissingActions.LOADING_DEFINITIONS_TABLE
      );
    } else if (errorType === 'API') {
      toast = {
        title: i18n.translate(
          'opensearch.reports.main.errorGeneratingReportDefinitionsTable.',
          { defaultMessage: 'Error generating report definitions table.' }
        ),
        color: 'danger',
        iconType: 'alert',
        id: 'reportDefinitionsTableErrorToast',
      };
    }
    setToasts(toasts.concat(toast));
  };

  const handleReportDefinitionsTableErrorToast = (errorType: string) => {
    addReportDefinitionsTableErrorToastHandler(errorType);
  };

  const addErrorOnDemandDownloadToastHandler = (
    title = i18n.translate('opensearch.reports.main.errorDownloadingReport', {
      defaultMessage: 'Error downloading report.',
    }),
    text = ''
  ) => {
    const errorToast = {
      title,
      text,
      color: 'danger',
      iconType: 'alert',
      id: 'onDemandDownloadErrorToast',
    };
    setToasts(toasts.concat(errorToast));
  };

  const handleOnDemandDownloadErrorToast = (title?: string, text?: string) => {
    addErrorOnDemandDownloadToastHandler(title, text);
  };

  const addSuccessOnDemandDownloadToastHandler = () => {
    const successToast = {
      title: i18n.translate(
        'opensearch.reports.main.successfullyDownloadedReport',
        { defaultMessage: 'Successfully downloaded report.' }
      ),
      color: 'success',
      iconType: 'check',
      id: 'onDemandDownloadSuccessToast',
    };
    setToasts(toasts.concat(successToast));
  };

  const handleOnDemandDownloadSuccessToast = () => {
    addSuccessOnDemandDownloadToastHandler();
  };

  const addCreateReportDefinitionSuccessToastHandler = () => {
    const successToast = {
      title: i18n.translate(
        'opensearch.reports.main.successfullyCreatedReportDefinition',
        { defaultMessage: 'Successfully created report definition.' }
      ),
      color: 'success',
      iconType: 'check',
      id: 'createReportDefinitionSuccessToast',
    };
    setToasts(toasts.concat(successToast));
  };

  const handleCreateReportDefinitionSuccessToast = () => {
    addCreateReportDefinitionSuccessToastHandler();
  };

  const addEditReportDefinitionSuccessToastHandler = () => {
    const successToast = {
      title: i18n.translate(
        'opensearch.reports.main.successfullyUpdatedReportDefinition',
        { defaultMessage: 'Successfully updated report definition.' }
      ),
      color: 'success',
      iconType: 'check',
      id: 'editReportDefinitionSuccessToast',
    };
    setToasts(toasts.concat(successToast));
  };

  const handleEditReportDefinitionSuccessToast = () => {
    addEditReportDefinitionSuccessToastHandler();
  };

  const addDeleteReportDefinitionSuccessToastHandler = () => {
    const successToast = {
      title: i18n.translate(
        'opensearch.reports.main.successfullyDeletedReportDefinition',
        { defaultMessage: 'Successfully deleted report definition.' }
      ),
      color: 'success',
      iconType: 'check',
      id: 'deleteReportDefinitionSuccessToast',
    };
    setToasts(toasts.concat(successToast));
  };

  const handleDeleteReportDefinitionSuccessToast = () => {
    addDeleteReportDefinitionSuccessToastHandler();
  };

  const removeToast = (removedToast) => {
    setToasts(toasts.filter((toast) => toast.id !== removedToast.id));
  };

  const pagination = {
    initialPageSize: 10,
    pageSizeOptions: [5, 10, 20],
  };

  useEffect(() => {
    props.setBreadcrumbs([
      {
        text: i18n.translate('opensearch.reports.main.title.reporting', {
          defaultMessage: 'Reporting',
        }),
        href: '#',
      },
    ]);
    refreshReportsTable();
    refreshReportsDefinitionsTable();

    if (window.location.href.includes('create=success')) {
      handleCreateReportDefinitionSuccessToast();
      // refresh might not fetch the latest changes when coming from create or edit page
      // workaround to wait 1 second and refresh again
      setTimeout(() => {
        refreshReportsTable();
        refreshReportsDefinitionsTable();
      }, 1000);
    } else if (window.location.href.includes('edit=success')) {
      handleEditReportDefinitionSuccessToast();
      setTimeout(() => {
        refreshReportsTable();
        refreshReportsDefinitionsTable();
      }, 1000);
    } else if (window.location.href.includes('delete=success')) {
      handleDeleteReportDefinitionSuccessToast();
      setTimeout(() => {
        refreshReportsTable();
        refreshReportsDefinitionsTable();
      }, 1000);
    }
    window.location.href = 'reports-dashboards#/';
  }, []);

  const refreshReportsTable = async () => {
    const { httpClient } = props;
    await httpClient
      .get('../api/reporting/reports')
      .then((response) => {
        setReportsTableContent(addReportsTableContent(response.data));
      })
      .catch((error) => {
        console.log('error when fetching all reports: ', error);
        // permission denied error
        if (error.body.statusCode === 403) {
          handleReportsTableErrorToast('permissions');
        } else {
          handleReportsTableErrorToast('API');
        }
      });
  };

  const refreshReportsDefinitionsTable = async () => {
    const { httpClient } = props;
    await httpClient
      .get('../api/reporting/reportDefinitions')
      .then((response) => {
        setReportDefinitionsTableContent(
          addReportDefinitionsTableContent(response.data)
        );
      })
      .catch((error) => {
        console.log('error when fetching all report definitions: ', error);
        if (error.body.statusCode === 403) {
          handleReportDefinitionsTableErrorToast('permissions');
        } else {
          handleReportDefinitionsTableErrorToast('API');
        }
      });
  };

  return (
    <div>
      <EuiPanel paddingSize={'l'}>
        <EuiFlexGroup justifyContent="spaceEvenly">
          <EuiFlexItem>
            <EuiTitle>
              <h2>
                {i18n.translate('opensearch.reports.main.title.reports', {
                  defaultMessage: 'Reports',
                })}{' '}
                <p style={reportCountStyles}> ({reportsTableContent.length})</p>
              </h2>
            </EuiTitle>
          </EuiFlexItem>
          <EuiFlexItem component="span" grow={false}>
            <EuiButton
              onClick={refreshReportsTable}
              iconSide="left"
              iconType="refresh"
            >
              {i18n.translate(
                'opensearch.reports.main.reports.button.refresh',
                { defaultMessage: 'Refresh' }
              )}
            </EuiButton>
          </EuiFlexItem>
        </EuiFlexGroup>
        <EuiHorizontalRule />
        <ReportsTable
          pagination={pagination}
          reportsTableItems={reportsTableContent}
          httpClient={props['httpClient']}
          handleSuccessToast={handleOnDemandDownloadSuccessToast}
          handleErrorToast={handleOnDemandDownloadErrorToast}
          handlePermissionsMissingToast={handlePermissionsMissingDownloadToast}
        />
      </EuiPanel>
      <EuiSpacer />
      <EuiPanel paddingSize={'l'}>
        <EuiFlexGroup justifyContent="spaceEvenly">
          <EuiFlexItem>
            <EuiTitle>
              <h2>
                {i18n.translate(
                  'opensearch.reports.main.title.reportDefinitions',
                  { defaultMessage: 'Report definitions' }
                )}
                <p style={reportCountStyles}>
                  {' '}
                  ({reportDefinitionsTableContent.length})
                </p>
              </h2>
            </EuiTitle>
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiButton
              onClick={refreshReportsDefinitionsTable}
              iconSide="left"
              iconType="refresh"
            >
              {i18n.translate(
                'opensearch.reports.main.reportDefinitions.button.refresh',
                { defaultMessage: 'Refresh' }
              )}
            </EuiButton>
          </EuiFlexItem>
          <EuiFlexItem component="span" grow={false}>
            <EuiButton
              fill={true}
              onClick={() => {
                window.location.assign('reports-dashboards#/create');
              }}
              id={'createReportHomepageButton'}
            >
              {i18n.translate(
                'opensearch.reports.main.reportDefinitions.button.create',
                { defaultMessage: 'Create' }
              )}
            </EuiButton>
          </EuiFlexItem>
        </EuiFlexGroup>
        <EuiHorizontalRule />
        <ReportDefinitions
          pagination={pagination}
          reportDefinitionsTableContent={reportDefinitionsTableContent}
        />
      </EuiPanel>
      <EuiGlobalToastList
        toasts={toasts}
        dismissToast={removeToast}
        toastLifeTimeMs={6000}
      />
    </div>
  );
}
