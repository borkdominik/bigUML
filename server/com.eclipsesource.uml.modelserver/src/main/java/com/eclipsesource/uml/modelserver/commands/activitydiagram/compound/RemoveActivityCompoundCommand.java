package com.eclipsesource.uml.modelserver.commands.activitydiagram.compound;

import com.eclipsesource.uml.modelserver.commands.activitydiagram.notation.RemoveActivityShapeCommand;
import com.eclipsesource.uml.modelserver.commands.activitydiagram.semantic.RemoveActivityCommand;
import com.eclipsesource.uml.modelserver.commands.commons.util.UmlSemanticCommandUtil;
import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;

public class RemoveActivityCompoundCommand extends CompoundCommand {
    //TODO: RATHER USE THE RemoveClassCompoundCommand EXAMPLE HERE
    public RemoveActivityCompoundCommand(final EditingDomain domain, final URI modelUri, final String activityUri) {
        RemoveActivityCommand command = new RemoveActivityCommand(domain, modelUri, activityUri);
        command.getOwnedElements().forEach(edge -> {
            String elementUri = UmlSemanticCommandUtil.getSemanticUriFragment(edge);
            this.append(new RemoveActivityShapeCommand(domain, modelUri, elementUri));
        });
        command.getReferencingCallBehaviorActions().forEach(cba -> {
            String elemUri = UmlSemanticCommandUtil.getSemanticUriFragment(cba);
            //TODO: Check how it interacts with the ACTION node where it comes from!
            //this.append(new SetBehaviorCommand(domain, modelUri, elemUri, null));
        });
        this.append(command);
        this.append(new RemoveActivityShapeCommand(domain, modelUri, activityUri));
    }

}
