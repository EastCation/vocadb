import Breadcrumb from '@/Bootstrap/Breadcrumb';
import SafeAnchor from '@/Bootstrap/SafeAnchor';
import { Layout } from '@/Components/Shared/Layout';
import { ArchivedObjectVersionProperties } from '@/Components/Shared/Partials/ArchivedEntry/ArchivedObjectVersionProperties';
import { HiddenBanner } from '@/Components/Shared/Partials/EntryDetails/HiddenBanner';
import { ReportEntryVersionPopupKnockout } from '@/Components/Shared/Partials/EntryDetails/ReportEntryVersionPopupKnockout';
import { PrintArchivedTagData } from '@/Components/Shared/Partials/Tag/PrintArchivedTagData';
import { useChangedFieldNames } from '@/Components/useChangedFieldNames';
import { useVdbTitle } from '@/Components/useVdbTitle';
import { ArchivedTagVersionDetailsContract } from '@/DataContracts/Tag/ArchivedTagVersionDetailsContract';
import JQueryUIButton from '@/JQueryUI/JQueryUIButton';
import { EntryType } from '@/Models/EntryType';
import { LoginManager } from '@/Models/LoginManager';
import { TagRepository } from '@/Repositories/TagRepository';
import { EntryUrlMapper } from '@/Shared/EntryUrlMapper';
import { HttpClient } from '@/Shared/HttpClient';
import { ArchivedEntryStore } from '@/Stores/ArchivedEntryStore';
import { useLocationStateStore } from '@vocadb/route-sphere';
import { runInAction } from 'mobx';
import { observer } from 'mobx-react-lite';
import qs from 'qs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams, useSearchParams } from 'react-router-dom';

const loginManager = new LoginManager(vdb.values);

const httpClient = new HttpClient();

const tagRepo = new TagRepository(httpClient, vdb.values.baseAddress);

interface TagViewVersionLayoutProps {
	contract: ArchivedTagVersionDetailsContract;
	archivedEntryStore: ArchivedEntryStore;
}

const TagViewVersionLayout = observer(
	({
		contract,
		archivedEntryStore,
	}: TagViewVersionLayoutProps): React.ReactElement => {
		const { t } = useTranslation(['ViewRes']);

		const title = `Revision ${contract.archivedVersion.version} for ${contract.name}`; /* TODO: localize */

		useVdbTitle(title, true);

		const changedFieldNames = useChangedFieldNames();

		useLocationStateStore(archivedEntryStore);

		return (
			<Layout
				title={title}
				parents={
					<>
						<Breadcrumb.Item
							linkAs={Link}
							linkProps={{
								to: '/Tag',
							}}
							divider
						>
							{t(`ViewRes:Shared.Tags`)}
						</Breadcrumb.Item>
						<Breadcrumb.Item
							linkAs={Link}
							linkProps={{
								to: EntryUrlMapper.details(EntryType.Tag, contract.tag.id),
							}}
							divider
						>
							{contract.tag.name}
						</Breadcrumb.Item>
						<Breadcrumb.Item
							linkAs={Link}
							linkProps={{
								to: `/Tag/Versions/${contract.tag.id}`,
							}}
						>
							Revisions{/* TODO: localize */}
						</Breadcrumb.Item>
					</>
				}
				toolbar={
					<>
						<JQueryUIButton
							as="a"
							href={`/Tag/ArchivedVersionXml/${contract.archivedVersion.id}`}
							icons={{ primary: 'ui-icon-arrowthickstop-1-s' }}
						>
							Download XML{/* TODO: localize */}
						</JQueryUIButton>{' '}
						<JQueryUIButton
							as={SafeAnchor}
							href="#"
							onClick={archivedEntryStore.reportStore.show}
							icons={{ primary: 'ui-icon-alert' }}
						>
							{t('ViewRes:EntryDetails.ReportAnError')}
						</JQueryUIButton>{' '}
						{loginManager.canViewHiddenRevisions &&
							(contract.archivedVersion.hidden ? (
								<JQueryUIButton
									as="a"
									href={`/Tag/UpdateVersionVisibility?${qs.stringify({
										archivedVersionId: contract.archivedVersion.id,
										hidden: false,
									})}`} /* TODO: Convert to POST. */
									onClick={(e): void => {
										if (
											!window.confirm(t('ViewRes:ViewVersion.ConfirmUnhide'))
										) {
											e.preventDefault();
										}
									}}
									icons={{ primary: 'ui-icon-unlocked' }}
								>
									{t('ViewRes:ViewVersion.UnhideVersion')}
								</JQueryUIButton>
							) : (
								<JQueryUIButton
									as="a"
									href={`/Tag/UpdateVersionVisibility?${qs.stringify({
										archivedVersionId: contract.archivedVersion.id,
										hidden: true,
									})}`} /* TODO: Convert to POST. */
									onClick={(e): void => {
										if (!window.confirm(t('ViewRes:ViewVersion.ConfirmHide'))) {
											e.preventDefault();
										}
									}}
									icons={{ primary: 'ui-icon-locked' }}
								>
									{t('ViewRes:ViewVersion.HideVersion')}
								</JQueryUIButton>
							))}
					</>
				}
			>
				{contract.archivedVersion.hidden && <HiddenBanner />}

				{contract.comparableVersions.length > 0 && (
					<form className="form form-inline">
						Compare to:{/* TODO: localize */}{' '}
						<select
							className="input-xlarge"
							value={archivedEntryStore.comparedVersionId}
							onChange={(e): void =>
								runInAction(() => {
									archivedEntryStore.comparedVersionId = e.target.value
										? Number(e.target.value)
										: undefined;
								})
							}
						>
							<option value="" />
							{contract.comparableVersions.map((comparableVersion) => (
								<option
									value={comparableVersion.id}
									key={comparableVersion.id}
								>{`${
									comparableVersion.version
								} (${comparableVersion.changedFields
									.map((changedField) =>
										changedFieldNames(EntryType.Tag, changedField),
									)
									.join(', ')} by ${comparableVersion.agentName})`}</option>
							))}
						</select>
					</form>
				)}

				<ArchivedObjectVersionProperties
					version={contract.archivedVersion}
					compareTo={contract.comparedVersion}
					entryType={EntryType.Tag}
				/>

				<PrintArchivedTagData comparedTags={contract.versions} />

				<ReportEntryVersionPopupKnockout
					reportEntryStore={archivedEntryStore.reportStore}
				/>
			</Layout>
		);
	},
);

const TagViewVersion = (): React.ReactElement => {
	const { id } = useParams();
	const [searchParams] = useSearchParams();
	const comparedVersionId = searchParams.get('comparedVersionId');

	const [model, setModel] = React.useState<{
		contract: ArchivedTagVersionDetailsContract;
		archivedEntryStore: ArchivedEntryStore;
	}>();

	React.useEffect(() => {
		tagRepo
			.getVersionDetails({
				id: Number(id),
				comparedVersionId: comparedVersionId
					? Number(comparedVersionId)
					: undefined,
			})
			.then((contract) =>
				setModel({
					contract: contract,
					archivedEntryStore: new ArchivedEntryStore(
						contract.tag.id,
						contract.archivedVersion.version,
						tagRepo,
					),
				}),
			);
	}, [id, comparedVersionId]);

	return model ? (
		<TagViewVersionLayout
			contract={model.contract}
			archivedEntryStore={model.archivedEntryStore}
		/>
	) : (
		<></>
	);
};

export default TagViewVersion;