package com.eclipsesource.uml.modelserver.commands.statemachinediagram.region;

import com.eclipsesource.uml.modelserver.commands.commons.contributions.UmlCompoundCommandContribution;
import com.eclipsesource.uml.modelserver.commands.commons.contributions.UmlNotationCommandContribution;
import com.eclipsesource.uml.modelserver.commands.commons.contributions.UmlSemanticCommandContribution;
import com.eclipsesource.uml.modelserver.commands.util.UmlNotationCommandUtil;
import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.emfcloud.modelserver.command.CCommandFactory;
import org.eclipse.emfcloud.modelserver.command.CCompoundCommand;
import org.eclipse.emfcloud.modelserver.common.codecs.DecodingException;
import org.eclipse.glsp.graph.GPoint;

public class AddRegionCommandContribution extends UmlCompoundCommandContribution {

   public static final String TYPE = "addRegionContribution";
   public static final String PARENT_SEMANTIC_URI_FRAGMENT = "semanticProxyUri";

   public static CCompoundCommand create(final GPoint position, final String parentSemanticUri) {
      CCompoundCommand addRegionCommand = CCommandFactory.eINSTANCE.createCompoundCommand();
      addRegionCommand.setType(TYPE);
      addRegionCommand.getProperties().put(UmlNotationCommandContribution.POSITION_X,
            String.valueOf(position.getX()));
      addRegionCommand.getProperties().put(UmlNotationCommandContribution.POSITION_Y,
            String.valueOf(position.getY()));
      addRegionCommand.getProperties().put(UmlSemanticCommandContribution.PARENT_SEMANTIC_URI_FRAGMENT,
            parentSemanticUri);
      return addRegionCommand;
   }

   @Override
   protected CompoundCommand toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
         throws DecodingException {
      GPoint regionPosition = UmlNotationCommandUtil.getGPoint(
            command.getProperties().get(UmlNotationCommandContribution.POSITION_X),
            command.getProperties().get(UmlNotationCommandContribution.POSITION_Y));

      String parentSemanticUriFragment = command.getProperties()
            .get(UmlSemanticCommandContribution.PARENT_SEMANTIC_URI_FRAGMENT);

      return new AddRegionCompoundCommand(domain, modelUri, regionPosition, parentSemanticUriFragment);
   }
}
