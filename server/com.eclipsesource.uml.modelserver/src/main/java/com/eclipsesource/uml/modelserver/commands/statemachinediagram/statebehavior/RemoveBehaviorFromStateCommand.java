package com.eclipsesource.uml.modelserver.commands.statemachinediagram.statebehavior;

import com.eclipsesource.uml.modelserver.commands.commons.semantic.UmlSemanticElementCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Behavior;
import org.eclipse.uml2.uml.State;
import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;

public class RemoveBehaviorFromStateCommand extends UmlSemanticElementCommand {

    protected final String parentSemanticUriFragment;
    protected final String semanticUriFragment;

    public RemoveBehaviorFromStateCommand(final EditingDomain domain, final URI modelUri,
                                          final String parentSemanticUriFragment,
                                          final String semanticUriFragment) {
        super(domain, modelUri);
        this.parentSemanticUriFragment = parentSemanticUriFragment;
        this.semanticUriFragment = semanticUriFragment;
    }

    @Override
    protected void doExecute() {
        State parentState = UmlSemanticCommandUtil.getElement(umlModel, parentSemanticUriFragment, State.class);
        Behavior behaviorToRemove = UmlSemanticCommandUtil.getElement(umlModel, semanticUriFragment, Behavior.class);
        if (behaviorToRemove != null) {
            if (behaviorToRemove.equals(parentState.getEntry())) {
                parentState.setEntry(null);
            } else if (behaviorToRemove.equals(parentState.getDoActivity())) {
                parentState.setDoActivity(null);
            } else if (behaviorToRemove.equals(parentState.getExit())) {
                parentState.setExit(null);
            }
        }
    }

}
