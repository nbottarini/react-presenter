import { ChangeFunc } from './ChangeFunc'

export abstract class PresenterBase<TModel = any> {
    protected _model: TModel

    protected constructor(protected onChange: ChangeFunc) {
        this._model = {} as TModel
    }

    get model(): TModel {
        return this._model
    }

    protected updateModel<K extends keyof TModel>(changes: Pick<TModel, K>): void {
        this._model = { ...this.model, ...changes }
        this.onChange(this._model)
    }
}
