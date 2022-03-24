package com.eclipsesource.uml.modelserver.commands.statemachinediagram.transition;

import com.eclipsesource.uml.modelserver.commands.commons.semantic.UmlSemanticElementCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Region;
import org.eclipse.uml2.uml.Transition;

public class RemoveTransitionCommand extends UmlSemanticElementCommand {

    protected final String parentSemanticUriFragment;
    protected final String semanticUriFragment;

    public RemoveTransitionCommand(final EditingDomain domain, final URI modelUri,
                                   final String parentSemanticUriFragment, final String semanticUriFragment) {
        super(domain, modelUri);
        this.parentSemanticUriFragment = parentSemanticUriFragment;
        this.semanticUriFragment = semanticUriFragment;
    }

    @Override
    protected void doExecute() {
        Region parentRegion = UmlSemanticCommandUtil.getElement(umlModel, semanticUriFragment, Region.class);
        Transition transitionToRemove = UmlSemanticCommandUtil.getElement(umlModel, semanticUriFragment, Transition.class);
        if (parentRegion != null && transitionToRemove != null) {
            parentRegion.getTransitions().remove(transitionToRemove);
        }
    }
}
