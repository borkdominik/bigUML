package com.eclipsesource.uml.modelserver.commands.statemachinediagram.statebehavior;

import com.eclipsesource.uml.modelserver.commands.commons.semantic.UmlSemanticElementCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Behavior;
import org.eclipse.uml2.uml.State;
import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;

public class SetBehaviorInStateCommand extends UmlSemanticElementCommand {

    protected String semanticUriFragment;
    protected String behaviorType;
    protected String newName;

    public SetBehaviorInStateCommand(final EditingDomain domain, final URI modelUri, final String semanticUriFragment,
                                     final String behaviorType, final String newName) {
        super(domain, modelUri);
        this.semanticUriFragment = semanticUriFragment;
        this.behaviorType = behaviorType;
        this.newName = newName;
    }

    @Override
    protected void doExecute() {
        Behavior behavior = UmlSemanticCommandUtil.getElement(umlModel, semanticUriFragment, Behavior.class);
        State container = (State) behavior.eContainer();

        switch (behaviorType) {
            case "node:state-entry-activity":
                behavior.setName(newName);
                container.setEntry(behavior);
                break;
            case "node:state-do-activity":
                behavior.setName(newName);
                container.setDoActivity(behavior);
                break;
            case "node:state-exit-activity":
                behavior.setName(newName);
                container.setExit(behavior);
                break;
        }
    }
}
