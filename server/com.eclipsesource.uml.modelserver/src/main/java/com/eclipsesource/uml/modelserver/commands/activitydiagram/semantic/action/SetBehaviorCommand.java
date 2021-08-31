package com.eclipsesource.uml.modelserver.commands.activitydiagram.semantic.action;

import com.eclipsesource.uml.modelserver.commands.commons.semantic.UmlSemanticElementCommand;

import java.util.Optional;

import com.eclipsesource.uml.modelserver.commands.commons.util.UmlSemanticCommandUtil;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Behavior;
import org.eclipse.uml2.uml.CallBehaviorAction;
import org.eclipse.uml2.uml.Model;


public class SetBehaviorCommand extends UmlSemanticElementCommand {

    protected String semanticUriFragment;
    protected String behaviorName;

    public SetBehaviorCommand(final EditingDomain domain, final URI modelUri, final String semanticUriFragment,
                              final String behaviorName) {
        super(domain, modelUri);
        this.semanticUriFragment = semanticUriFragment;
        this.behaviorName = behaviorName;
    }

    @Override
    protected void doExecute() {
        CallBehaviorAction cba = UmlSemanticCommandUtil.getElement(umlModel, semanticUriFragment,
                CallBehaviorAction.class);
        if (behaviorName == null) {
            cba.setBehavior(null);
            return;
        }

        Model model = cba.containingActivity().getModel();
        Optional<Behavior> result = model.getPackagedElements().stream()
                .filter(Behavior.class::isInstance)
                .map(Behavior.class::cast)
                .filter(b -> b.getName() != null)
                .filter(b -> b.getName().toLowerCase().equals(behaviorName.toLowerCase()))
                .findFirst();
        if (result.isPresent()) {
            cba.setBehavior(result.get());
        }
    }
}
