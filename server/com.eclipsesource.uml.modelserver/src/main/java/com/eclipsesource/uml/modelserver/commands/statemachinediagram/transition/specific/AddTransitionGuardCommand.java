package com.eclipsesource.uml.modelserver.commands.statemachinediagram.transition.specific;

import com.eclipsesource.uml.modelserver.commands.commons.semantic.UmlSemanticElementCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Transition;

public class AddTransitionGuardCommand extends UmlSemanticElementCommand {

    protected String semanticUriFragment;
    protected String newValue;

    public AddTransitionGuardCommand(final EditingDomain domain, final URI modelUri, final String semanticUriFragment,
                                     final String newValue) {
        super(domain, modelUri);
        this.semanticUriFragment = semanticUriFragment;
        this.newValue = newValue;
    }

    @Override
    protected void doExecute() {
        Transition transition = UmlSemanticCommandUtil.getElement(umlModel, semanticUriFragment, Transition.class);
        if (transition.getGuard() != null && !newValue.isEmpty()) {
            transition.getGuard().setName(newValue);
        } else if (transition.getGuard() != null && newValue.isEmpty()) {
            transition.getGuard().destroy();
        } else if (!newValue.isEmpty()) {
            transition.createGuard(newValue);
            transition.getGuard().setName("new guard");
        }
    }
}
