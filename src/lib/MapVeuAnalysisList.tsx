import React, { useCallback } from 'react';
import {
  AnalysisStore,
  useAnalysisList,
  useStudy,
} from '@veupathdb/eda-workspace-core';
import { useRouteMatch, Link, useHistory } from 'react-router-dom';
import { safeHtml } from '@veupathdb/wdk-client/lib/Utils/ComponentUtils';

interface Props {
  studyId: string;
  analysisStore: AnalysisStore;
}

export function AnalysisList(props: Props) {
  const { analysisStore, studyId } = props;
  const { studyRecord } = useStudy();
  const list = useAnalysisList();
  const { url } = useRouteMatch();
  const history = useHistory();
  const createAnalysis = useCallback(async () => {
    const id = await analysisStore.createAnalysis({
      name: 'Unnamed analysis',
      studyId,
      visualizations: [],
      variableUISettings: {},
      derivedVariables: [],
      starredVariables: [],
      filters: [],
    });
    history.push(`${url}/${id}`);
  }, [analysisStore, history, studyId, url]);
  return (
    <>
      <h2>Study: {studyRecord.displayName}</h2>
      <h3>Saved Analyses</h3>
      <div>
        <button className="btn" type="button" onClick={createAnalysis}>
          New Analysis
        </button>
      </div>
      {list.length === 0 ? (
        <em>You do not have any analyses for this study.</em>
      ) : (
        <ul>
          {list.map((analysis) => (
            <li>
              <Link to={`${url}/${analysis.id}`}>
                {safeHtml(analysis.name)}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
