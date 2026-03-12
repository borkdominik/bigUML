/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
/* import {
    type Action,
    //CreateNodeOperation,
    type IActionDispatcher,
    type IActionHandler,
    type ICommand,
    TYPES
} from '@eclipse-glsp/client';
import { inject, injectable } from 'inversify';
import { GenerateDiagramRequestAction } from '../common/code-to-class-diagram.action.js';


@injectable()
export class CodeToClassDiagramHandler implements IActionHandler {

    @inject(TYPES.IActionDispatcher)
    protected actionDispatcher: IActionDispatcher;

    handle(action: Action): ICommand | Action | void {
            if(GenerateDiagramRequestAction.is(action)) {
                console.log("GLSP Client: Received action: ", action.kind);
                

                 this.actionDispatcher.dispatch(
                    CreateNodeOperation.create("activityNode")
                ); 

                console.log("GLSP Client: Action dispatched: ", action.kind);
            }
    }

    

}
 */