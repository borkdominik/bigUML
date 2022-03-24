package com.eclipsesource.uml.modelserver.commands.usecasediagram.generalization;

import com.eclipsesource.uml.modelserver.commands.commons.contributions.UmlCompoundCommandContribution;
import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.emfcloud.modelserver.command.CCommandFactory;
import org.eclipse.emfcloud.modelserver.command.CCompoundCommand;
import org.eclipse.emfcloud.modelserver.common.codecs.DecodingException;

public class RemoveGeneralizationCommandContribution extends UmlCompoundCommandContribution {

    public static final String TYPE = "removeGeneralization";

    public static CCompoundCommand create(final String semanticUriFragment) {
        CCompoundCommand removeGeneralizationCommand = CCommandFactory.eINSTANCE.createCompoundCommand();
        removeGeneralizationCommand.setType(TYPE);
        removeGeneralizationCommand.getProperties().put(SEMANTIC_URI_FRAGMENT, semanticUriFragment);
        return removeGeneralizationCommand;
    }

    @Override
    protected CompoundCommand toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
        throws DecodingException {
        String semanticUriFragment = command.getProperties().get(SEMANTIC_URI_FRAGMENT);
        return new RemoveGeneralizationCompoundCommand(domain, modelUri, semanticUriFragment);
    }
}
