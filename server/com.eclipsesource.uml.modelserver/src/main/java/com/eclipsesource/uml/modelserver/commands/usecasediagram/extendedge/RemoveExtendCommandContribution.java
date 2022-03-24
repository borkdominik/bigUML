package com.eclipsesource.uml.modelserver.commands.usecasediagram.extendedge;

import com.eclipsesource.uml.modelserver.commands.commons.contributions.UmlCompoundCommandContribution;
import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.emfcloud.modelserver.command.CCommandFactory;
import org.eclipse.emfcloud.modelserver.command.CCompoundCommand;
import org.eclipse.emfcloud.modelserver.common.codecs.DecodingException;

public class RemoveExtendCommandContribution extends UmlCompoundCommandContribution {

    public static final String TYPE = "removeExtend";

    public static CCompoundCommand create(final String semanticUriFragment) {
        CCompoundCommand removeExtendCommand = CCommandFactory.eINSTANCE.createCompoundCommand();
        removeExtendCommand.setType(TYPE);
        removeExtendCommand.getProperties().put(SEMANTIC_URI_FRAGMENT, semanticUriFragment);
        return removeExtendCommand;
    }

    @Override
    protected CompoundCommand toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
        throws DecodingException {
        String semanticUriFragment = command.getProperties().get(SEMANTIC_URI_FRAGMENT);
        return new RemoveExtendCompoundCommand(domain, modelUri, semanticUriFragment);
    }
}
