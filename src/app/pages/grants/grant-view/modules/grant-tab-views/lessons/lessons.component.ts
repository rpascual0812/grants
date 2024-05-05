import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Project, ProjectLesson } from 'src/app/interfaces/_project.interface';
import { GrantSignalService } from 'src/app/services/grant.signal.service';
import { ProjectService } from 'src/app/services/project.service';
import { UserSignalService } from 'src/app/services/user.signal.service';
import { extractErrorMessage } from 'src/app/utilities/application.utils';
import { PROJECT_LESSON_TYPES, ProjectLessonTypeKey } from 'src/app/utilities/constants';
import * as _ from '../../../../../../utilities/globals';

type EditableRow = {
    challengeRow: number | null;
    lessonRow: number | null;
};
@Component({
    selector: 'app-lessons',
    templateUrl: './lessons.component.html',
    styleUrls: ['./lessons.component.scss'],
})
export class LessonsComponent implements OnInit {
    loading = {
        challenges: true,
        lessons: true,
    };

    processing = {
        challenges: false,
        lessons: false,
    };

    project: Project | null = null;
    projectChallenges: ProjectLesson[] = [];
    projectLessons: ProjectLesson[] = [];

    editableRow: EditableRow = {
        challengeRow: null,
        lessonRow: null,
    };

    challengeForm: ProjectLesson = {
        type: PROJECT_LESSON_TYPES.challenges,
        type_content: '',
        description: '',
    };

    challengeFormRow: ProjectLesson = {
        type: PROJECT_LESSON_TYPES.challenges,
        type_content: '',
        description: '',
    };

    lessonForm: ProjectLesson = {
        type: PROJECT_LESSON_TYPES.lessons,
        type_content: '',
        description: '',
    };

    lessonFormRow: ProjectLesson = {
        type: PROJECT_LESSON_TYPES.lessons,
        type_content: '',
        description: '',
    };

    grantSignalService = inject(GrantSignalService);

    user: any = {};
    userSignalService = inject(UserSignalService);

    restrictions: any = _.RESTRICTIONS;
    permission = _.PERMISSIONS;

    constructor(
        private projectService: ProjectService,
        private toastr: ToastrService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.project = this.grantSignalService.project();
        this.fetch('challenges');
        this.fetch('lessons');

        this.user = this.userSignalService.user();

        this.user?.user_role?.forEach((user_role: any) => {
            this.permission.grant_application = this.restrictions[user_role.role.restrictions.grant_application] > this.restrictions[this.permission.grant_application] ? user_role.role.restrictions.grant_application : this.permission.grant_application;
        });
    }

    fetch(type: ProjectLessonTypeKey) {
        this.projectService
            .fetchProjectLesson({
                project_pk: this.project?.pk as number,
                query: `?type=${type}`,
            })
            .subscribe({
                next: (res: any) => {
                    const status = res?.status;
                    const data = res?.data;
                    if (status) {
                        if (type === 'challenges') {
                            this.projectChallenges = data;
                        } else {
                            this.projectLessons = data;
                        }
                    } else {
                        this.toastr.error(
                            `An error occurred while fetching Project Lesson Type ${type}. Please try again.`,
                            'ERROR!'
                        );
                    }
                    this.loading[type] = false;
                },
                error: (err) => {
                    const { statusCode, errorMessage } = extractErrorMessage(err);
                    this.toastr.error(
                        `An error occurred while fetching Project Lesson Type ${type}.  ${statusCode} ${errorMessage} Please try again.`,
                        'ERROR!'
                    );
                    this.loading[type] = false;
                },
            });
    }

    modifyList(list: ProjectLesson[], data: ProjectLesson) {
        const existing = list.find((item) => item?.pk === data?.pk);
        if (existing) {
            return list.map((item) => {
                if (item.pk === existing?.pk) {
                    item = data;
                }
                return {
                    ...item,
                };
            });
        } else {
            return (list = [...list, data]);
        }
    }

    removeFromList(list: ProjectLesson[], data: ProjectLesson) {
        return list.filter((item) => item?.pk !== data?.pk);
    }

    save(value: ProjectLesson, type: ProjectLessonTypeKey) {
        this.processing[type] = true;
        this.projectService
            .saveProjectLesson({
                project_pk: this.project?.pk as number,
                ...value,
            })
            .subscribe({
                next: (res: any) => {
                    const status = res?.status;
                    const data = res?.data;
                    if (status) {
                        if (type === 'challenges') {
                            this.projectChallenges = this.modifyList(this.projectChallenges, data) ?? [];
                        } else {
                            this.projectLessons = this.modifyList(this.projectLessons, data) ?? [];
                        }
                        this.toastr.success(`Project Lesson Type ${type} has been successfully saved`, 'SUCCESS!');
                        this.cdr.detectChanges();
                    } else {
                        this.toastr.error(
                            `An error occurred while saving Project Lesson Type ${type}. Please try again.`,
                            'ERROR!'
                        );
                    }
                    this.processing[type] = false;
                },
                error: (err: any) => {
                    const { statusCode, errorMessage } = extractErrorMessage(err);
                    this.toastr.error(
                        `An error occurred while saving Project Lesson Type ${type}.  ${statusCode} ${errorMessage} Please try again.`,
                        'ERROR!'
                    );
                    this.processing[type] = false;
                },
            });
    }

    delete(value: ProjectLesson, type: ProjectLessonTypeKey) {
        this.processing[type] = true;
        this.projectService
            .deleteProjectLesson({
                project_pk: this.project?.pk as number,
                pk: value?.pk as number,
            })
            .subscribe({
                next: (res: any) => {
                    const status = res?.status;
                    if (status) {
                        if (type === 'challenges') {
                            this.projectChallenges = this.removeFromList(this.projectChallenges, value) ?? [];
                        } else {
                            this.projectLessons = this.removeFromList(this.projectLessons, value) ?? [];
                        }
                        this.cdr.detectChanges();
                    } else {
                        this.toastr.error(
                            `An error occurred while deleting Project Lesson Type ${type}. Please try again.`,
                            'ERROR!'
                        );
                    }
                    this.processing[type] = false;
                },
                error: (err: any) => {
                    const { statusCode, errorMessage } = extractErrorMessage(err);
                    this.toastr.error(
                        `An error occurred while deleting Project Lesson Type ${type}.  ${statusCode} ${errorMessage} Please try again.`,
                        'ERROR!'
                    );
                    this.processing[type] = false;
                },
            });
    }

    handleAdd(type: ProjectLessonTypeKey) {
        if (type === 'lessons') {
            this.save(this.lessonForm, type);
            this.lessonForm.type_content = '';
            this.lessonForm.description = '';
        } else {
            this.save(this.challengeForm, type);
            this.challengeForm.type_content = '';
            this.challengeForm.description = '';
        }
    }

    handleEdit(type: ProjectLessonTypeKey, item?: ProjectLesson) {
        if (type === 'lessons') {
            this.editableRow.lessonRow = item?.pk ?? null;
            this.lessonFormRow.type_content = item?.type_content ?? '';
            this.lessonFormRow.description = item?.description ?? '';
        } else {
            this.editableRow.challengeRow = item?.pk ?? null;
            this.challengeFormRow.type_content = item?.type_content ?? '';
            this.challengeFormRow.description = item?.description ?? '';
        }
    }

    handleSaveRow(type: ProjectLessonTypeKey, itemPk: number) {
        const data = type === 'challenges' ? this.challengeFormRow : this.lessonFormRow;
        const fieldValue = Object.keys(data).map((key) => ({
            key,
            value: data[key as keyof typeof data],
        }));
        const isInvalid = fieldValue?.find((item) => typeof item.value === 'string' && item.value?.trim() === '');
        if (isInvalid) {
            this.toastr.error(`Fields are required`, 'ERROR!');
        } else {
            this.save(
                {
                    pk: itemPk,
                    ...data,
                },
                type
            );
            const rowKey = type === 'challenges' ? 'challengeRow' : 'lessonRow';
            this.editableRow[rowKey] = null;
        }
    }
}
