import {
  EDAAnalysisListContainer,
  EDAWorkspaceContainer,
} from '@veupathdb/eda-workspace-core';
import { EdaClient } from '@veupathdb/eda-workspace-core/lib/api/eda-api';
import React from 'react';
import {
  Route,
  RouteComponentProps,
  Switch,
  useRouteMatch,
} from 'react-router';
import { AnalysisList } from './MapVeuAnalysisList';
import { MapVeuAnalysis } from './MapVeuAnalysis';
import { mockAnalysisStore } from './Mocks';
import { StudyList } from './StudyList';

const edaClient = new (class extends EdaClient {
  getStudyMetadata() {
    // Temporarily hardcode a study id. We don't yet have a way to
    // discover the id used by the subsetting service, from the WDK
    // study record.
    return super.getStudyMetadata('SCORECX01-1');
  }
})({ baseUrl: '/eda-service' });

export function MapVeuContainer() {
  // This will get the matched path of the active parent route.
  // This is useful so we don't have to hardcode the path root.
  const { path } = useRouteMatch();
  return (
    <>
      <h1>MapVEu</h1>
      <Switch>
        <Route
          path={`${path}/:studyId/:analysisId`}
          render={(
            props: RouteComponentProps<{ studyId: string; analysisId: string }>
          ) => (
            <EDAWorkspaceContainer
              studyId={props.match.params.studyId}
              analysisId={props.match.params.analysisId}
              analysisStore={mockAnalysisStore}
              edaClient={edaClient}
            >
              <MapVeuAnalysis />
            </EDAWorkspaceContainer>
          )}
        />
        <Route
          path={`${path}/:studyId`}
          render={(props: RouteComponentProps<{ studyId: string }>) => (
            <EDAAnalysisListContainer
              studyId={props.match.params.studyId}
              analysisStore={mockAnalysisStore}
              studyMetadataStore={edaClient}
            >
              <AnalysisList
                studyId={props.match.params.studyId}
                analysisStore={mockAnalysisStore}
              />
            </EDAAnalysisListContainer>
          )}
        />
        <Route path={path} component={StudyList} />
      </Switch>
    </>
  );
}
